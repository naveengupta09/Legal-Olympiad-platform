const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const uploadService = require("./upload.service");

const getProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate("college", "name logo location rank")
    .populate("achievements", "title icon points type")
    .populate("enrolledCourses", "title coverImage level");

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = ["name", "phone", "bio", "socialLinks"];
  const filtered = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) filtered[key] = updateData[key];
  }

  const user = await User.findByIdAndUpdate(userId, filtered, {
    new: true,
    runValidators: true,
  }).populate("college", "name logo");

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateAvatar = async (userId, file) => {
  const url = await uploadService.uploadImage(file, "avatars");
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: url },
    { new: true }
  );
  return user;
};

const getAllStudents = async (queryParams) => {
  const { page, limit, search, college, sort } = queryParams;

  const query = { role: "student", isActive: true };
  if (search) query.name = { $regex: search, $options: "i" };
  if (college) query.college = college;

  const sortOption =
    sort === "rank" ? { rank: 1 } :
    sort === "score" ? { totalScore: -1 } :
    { createdAt: -1 };

  return paginate(User, query, {
    page,
    limit,
    sort: sortOption,
    populate: [{ path: "college", select: "name logo" }],
    select: "name email avatar college totalScore rank createdAt",
  });
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .populate("college", "name logo location")
    .select("-password");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const deactivateUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

module.exports = { getProfile, updateProfile, updateAvatar, getAllStudents, getUserById, deactivateUser };