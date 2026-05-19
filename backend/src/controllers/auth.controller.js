const authService  = require("../services/auth.service");
const ApiResponse  = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge:   30 * 24 * 60 * 60 * 1000,
};

// ── Register ──────────────────────────────────────────────────────────────────
// Accepts: { name, email, password, role, college? }
// college is only sent when role === "college_admin"
// college: { name, location: { city, state }, website?, email?, phone?, description? }
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, college } = req.body;

  const { user, accessToken, refreshToken } = await authService.register(
    { name, email, password, role, college },
    req
  );

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user, accessToken }, "Registration successful"));
});

// ── Login ─────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);

  if (result.requires2FA) {
    return res.json(
      new ApiResponse(200, { requires2FA: true, tempToken: result.tempToken }, "OTP required")
    );
  }

  res
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: result.user, accessToken: result.accessToken }, "Login successful"));
});

// ── Logout ────────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logout(req.user._id, refreshToken);
  res.clearCookie("refreshToken").json(new ApiResponse(200, null, "Logged out successfully"));
});

const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user._id);
  res.clearCookie("refreshToken").json(new ApiResponse(200, null, "Logged out from all devices"));
});

// ── Get current user ──────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, "User fetched"));
});

// ── Email verification ────────────────────────────────────────────────────────
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.query.token);
  res.json(new ApiResponse(200, user, "Email verified successfully"));
});

// ── Password reset ────────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json(new ApiResponse(200, null, "Password reset email sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.query.token, req.body.password);
  res.json(new ApiResponse(200, user, "Password reset successful"));
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  res.json(new ApiResponse(200, null, "Password changed successfully"));
});

// ── Session management ────────────────────────────────────────────────────────
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await authService.getSessions(req.user._id);
  res.json(new ApiResponse(200, sessions, "Sessions fetched"));
});

const revokeSession = asyncHandler(async (req, res) => {
  await authService.revokeSession(req.user._id, req.params.sessionId);
  res.json(new ApiResponse(200, null, "Session revoked"));
});

// ── 2FA ───────────────────────────────────────────────────────────────────────
// These are optional — only available if speakeasy is installed
// If not installed, they return a 501 Not Implemented
const twoFAHandler = (name) => asyncHandler(async (req, res) => {
  if (typeof authService[name] !== "function") {
    return res.status(501).json(new ApiResponse(501, null, "2FA not configured on this server"));
  }
  try {
    if (name === "generate2FASecret") {
      const data = await authService.generate2FASecret(req.user._id);
      return res.json(new ApiResponse(200, data, "Scan QR code in your authenticator app"));
    }
    if (name === "verify2FAAndEnable") {
      await authService.verify2FAAndEnable(req.user._id, req.body.otp);
      return res.json(new ApiResponse(200, null, "2FA enabled successfully"));
    }
    if (name === "verifyLoginOTP") {
      const jwt     = require("jsonwebtoken");
      const decoded = jwt.verify(req.body.tempToken, process.env.JWT_SECRET);
      const result  = await authService.verifyLoginOTP(decoded.id, req.body.otp, req);
      return res
        .cookie("refreshToken", result.refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: result.user, accessToken: result.accessToken }, "Login successful"));
    }
    if (name === "disable2FA") {
      await authService.disable2FA(req.user._id, req.body.otp);
      return res.json(new ApiResponse(200, null, "2FA disabled"));
    }
  } catch (err) {
    throw err;
  }
});

const setup2FA   = twoFAHandler("generate2FASecret");
const enable2FA  = twoFAHandler("verify2FAAndEnable");
const verify2FA  = twoFAHandler("verifyLoginOTP");
const disable2FA = twoFAHandler("disable2FA");

// ── OAuth callbacks ───────────────────────────────────────────────────────────
const oauthCallback = (provider) =>
  asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.oauthLogin(req.user, req);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.redirect(
      `${process.env.CLIENT_URL}/oauth/callback#token=${accessToken}&provider=${provider}`
    );
  });

module.exports = {
  register, login, logout, logoutAll, getMe,
  verifyEmail, forgotPassword, resetPassword, changePassword,
  getSessions, revokeSession,
  setup2FA, enable2FA, verify2FA, disable2FA,
  oauthCallback,
};