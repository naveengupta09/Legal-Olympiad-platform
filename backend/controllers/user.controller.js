const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.json(new ApiResponse(200, user, "Profile fetched"));
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.json(new ApiResponse(200, user, "Profile updated"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userService.updateAvatar(req.user._id, req.file);
  res.json(new ApiResponse(200, user, "Avatar updated"));
});

const getAllStudents = asyncHandler(async (req, res) => {
  const result = await userService.getAllStudents(req.query);
  res.json(new ApiResponse(200, result, "Students fetched"));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(new ApiResponse(200, user, "User fetched"));
});

const deactivateUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id);
  res.json(new ApiResponse(200, null, "User deactivated"));
});

module.exports = { getMyProfile, updateMyProfile, updateAvatar, getAllStudents, getUserById, deactivateUser };