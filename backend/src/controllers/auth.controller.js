const { ENV } = require("../config/env");
const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, college } = req.body;
  const { user, accessToken, refreshToken } = await authService.register({
    name, email, password, role, college,
  });
  res
    .status(201)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(201, { user, accessToken }, "Registration successful"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, password });
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.query.token);
  res.json(new ApiResponse(200, user, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json(new ApiResponse(200, null, "Password reset email sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.query.token, req.body.password);
  res.json(new ApiResponse(200, user, "Password reset successful"));
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json(new ApiResponse(200, null, "Password changed successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, "User fetched"));
});

module.exports = { register, login, logout, verifyEmail, forgotPassword, resetPassword, changePassword, getMe };