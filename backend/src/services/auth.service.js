const crypto  = require("crypto");
const User    = require("../models/User.model");
const College = require("../models/College.model");
const ApiError= require("../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const emailService = require("./email.service");

// ── Try to load optional ua-parser-js ────────────────────────────────────────
let UAParser;
try { UAParser = require("ua-parser-js"); } catch { UAParser = null; }

const parseDevice = (req) => {
  if (!UAParser) return { device: "Desktop", browser: "Unknown", os: "Unknown", ip: "" };
  const ua     = new UAParser(req.headers["user-agent"] || "");
  const result = ua.getResult();
  return {
    device:  result.device.type  || "Desktop",
    browser: result.browser.name || "Unknown",
    os:      result.os.name      || "Unknown",
    ip:      req.ip || req.connection?.remoteAddress || "",
  };
};

// ── Issue tokens and store session ────────────────────────────────────────────
const issueTokens = async (user, req) => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Ensure sessions array exists (safety net)
  if (!Array.isArray(user.sessions)) user.sessions = [];

  const deviceInfo = parseDevice(req);
  user.sessions.push({ token: refreshToken, ...deviceInfo });

  // Keep max 5 sessions
  if (user.sessions.length > 5) {
    user.sessions = user.sessions.slice(-5);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ─────────────────────────────────────────────────────────────────────────────
//  REGISTER
//  - Student: creates user only
//  - College Admin: creates user + college atomically (rollback on failure)
// ─────────────────────────────────────────────────────────────────────────────
const register = async ({ name, email, password, role, college: collegePayload }, req) => {

  // 1. Duplicate email check
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  // 2. College-admin: validate college before creating user
  if (role === "college_admin") {
    if (!collegePayload || !collegePayload.name?.trim()) {
      throw new ApiError(400, "College name is required for College Admin accounts");
    }
    const collegeTaken = await College.findOne({
      name: { $regex: `^${collegePayload.name.trim()}$`, $options: "i" },
    });
    if (collegeTaken) {
      throw new ApiError(409, `"${collegePayload.name}" is already registered. Contact your existing admin.`);
    }
  }

  // 3. Hash verification token
  const rawToken  = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  // 4. Create user
  const user = await User.create({
    name:                   name.trim(),
    email:                  email.toLowerCase().trim(),
    password,
    role:                   role || "student",
    emailVerificationToken: hashToken,
  });

  // 5. College admin: create college and link it
  if (role === "college_admin" && collegePayload) {
    let college;
    try {
      college = await College.create({
        name:        collegePayload.name.trim(),
        location: {
          city:    collegePayload.location?.city    || "",
          state:   collegePayload.location?.state   || "",
          country: collegePayload.location?.country || "India",
        },
        website:     collegePayload.website     || "",
        email:       collegePayload.email       || "",
        phone:       collegePayload.phone       || "",
        description: collegePayload.description || "",
        admin:       user._id,
        affiliatedStudents: [user._id],
        stats: { totalStudents: 1 },
      });
    } catch (err) {
      // Rollback: delete the user so nothing is left in a broken state
      await User.findByIdAndDelete(user._id);
      throw new ApiError(500, "College creation failed. Please try again. Error: " + err.message);
    }

    // Link college to user
    user.college = college._id;
    await user.save({ validateBeforeSave: false });
  }

  // 6. Send verification email (don't block registration if it fails)
  try {
    await emailService.sendVerificationEmail(user.email, user.name, rawToken);
  } catch (emailErr) {
    console.error("Verification email failed:", emailErr.message);
  }

  // 7. Issue tokens
  const { accessToken, refreshToken } = await issueTokens(user, req);

  // 8. Return user with college populated
  const populatedUser = await User.findById(user._id)
    .populate("college", "name logo location isVerified");

  return { user: populatedUser, accessToken, refreshToken };
};

// ─────────────────────────────────────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────────────────────────────────────
const login = async ({ email, password }, req) => {
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase().trim() })
    .select("+password +twoFactorSecret");

  if (!user) throw new ApiError(401, "Invalid email or password");

  // OAuth-only accounts have no password
  if (!user.password) {
    throw new ApiError(401, "This account uses Google/GitHub login. Please use that instead.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isActive) throw new ApiError(403, "Your account has been deactivated. Contact support.");

  // 2FA check
  if (user.isTwoFactorEnabled) {
    const tempToken = generateAccessToken(user._id);
    return { requires2FA: true, tempToken };
  }

  const { accessToken, refreshToken } = await issueTokens(user, req);

  const populatedUser = await User.findById(user._id)
    .populate("college", "name logo location");

  return { user: populatedUser, accessToken, refreshToken, requires2FA: false };
};

// ── OAuth login (called after passport validates) ──────────────────────────────
const oauthLogin = async (user, req) => {
  if (!user.isActive) throw new ApiError(403, "Account deactivated");
  const { accessToken, refreshToken } = await issueTokens(user, req);
  const populatedUser = await User.findById(user._id).populate("college", "name logo");
  return { user: populatedUser, accessToken, refreshToken };
};

// ── Session management ─────────────────────────────────────────────────────────
const logout = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { sessions: { token: refreshToken } },
  });
};

const logoutAll = async (userId) => {
  await User.findByIdAndUpdate(userId, { $set: { sessions: [] } });
};

const revokeSession = async (userId, sessionId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  user.sessions = user.sessions.filter((s) => s._id.toString() !== sessionId);
  await user.save({ validateBeforeSave: false });
};

const getSessions = async (userId) => {
  const user = await User.findById(userId).select("sessions");
  if (!user) throw new ApiError(404, "User not found");
  return user.sessions;
};

// ── Email verification ─────────────────────────────────────────────────────────
const verifyEmail = async (token) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user   = await User.findOne({ emailVerificationToken: hashed });
  if (!user) throw new ApiError(400, "Invalid or expired verification link");
  user.isEmailVerified        = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });
  return user;
};

// ── Forgot / reset password ────────────────────────────────────────────────────
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw new ApiError(404, "No account found with that email");

  const rawToken  = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken   = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  await emailService.sendPasswordResetEmail(user.email, user.name, rawToken);
  return true;
};

const resetPassword = async (token, newPassword) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user   = await User.findOne({
    passwordResetToken:   hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");
  user.password             = newPassword;
  user.passwordResetToken   = undefined;
  user.passwordResetExpires = undefined;
  user.sessions             = []; // invalidate all sessions
  await user.save();
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");
  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw new ApiError(400, "Current password is incorrect");
  user.password = newPassword;
  user.sessions = [];
  await user.save();
  return true;
};

module.exports = {
  register,
  login,
  oauthLogin,
  logout,
  logoutAll,
  revokeSession,
  getSessions,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};