const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const { ROLES } = require("../config/constants");

// ── Session sub-document ──────────────────────────────────────────────────────
const sessionSchema = new mongoose.Schema({
  token:     { type: String, required: true },
  device:    { type: String, default: "Desktop" },
  browser:   { type: String, default: "Unknown" },
  os:        { type: String, default: "Unknown" },
  ip:        { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastUsed:  { type: Date, default: Date.now },
});

// ── User schema ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    // Not required — OAuth users have no password
    password: {
      type:      String,
      minlength: [8, "Password must be at least 8 characters"],
      select:    false,
    },

    // OAuth providers
    googleId: { type: String, default: null, select: false },
    githubId: { type: String, default: null, select: false },

    // Two-factor auth
    twoFactorSecret:    { type: String, default: null, select: false },
    isTwoFactorEnabled: { type: Boolean, default: false },

    // Active sessions (max 5 stored)
    sessions: {
      type:    [sessionSchema],
      default: [],       // ← explicit default so .push() never throws
    },

    role:    { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    avatar:  { type: String, default: "" },
    phone:   { type: String, default: "" },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", default: null },
    bio:     { type: String, maxlength: 500, default: "" },

    enrolledCourses:       [{ type: mongoose.Schema.Types.ObjectId, ref: "Course"      }],
    registeredCompetitions:[{ type: mongoose.Schema.Types.ObjectId, ref: "Competition" }],
    achievements:          [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],

    totalScore:      { type: Number, default: 0 },
    rank:            { type: Number, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isActive:        { type: Boolean, default: true },

    emailVerificationToken: { type: String, select: false },
    passwordResetToken:     { type: String, select: false },
    passwordResetExpires:   { type: Date,   select: false },

    lastLogin:   { type: Date },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter:  { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// ── Pre-save: hash password only when modified ─────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Methods ───────────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  const HIDDEN = [
    "password", "twoFactorSecret", "googleId", "githubId",
    "emailVerificationToken", "passwordResetToken", "passwordResetExpires",
  ];
  HIDDEN.forEach((k) => delete obj[k]);
  return obj;
};

module.exports = mongoose.model("User", userSchema);