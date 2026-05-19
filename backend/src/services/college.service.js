const College = require("../models/College.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const uploadService = require("./upload.service");
const { ROLES } = require("../config/constants");

const createCollege = async (data, adminId) => {
  const name = (data.name || "").trim();
  const exists = await College.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
  if (exists) throw new ApiError(409, "College already registered");

  const college = await College.create({ ...data, name, admin: adminId });

  await User.findByIdAndUpdate(adminId, {
    college: college._id,
    role: ROLES.COLLEGE_ADMIN,
  });

  return college;
};

const getCollegeById = async (collegeId) => {
  const college = await College.findById(collegeId)
    .populate("admin", "name email avatar")
    .populate("affiliatedStudents", "name avatar totalScore rank");

  if (!college) throw new ApiError(404, "College not found");
  return college;
};

const getAllColleges = async (queryParams) => {
  const { page, limit, search, sort } = queryParams;

  const query = { isActive: true };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { "location.state": { $regex: search, $options: "i" } },
    ];
  }

  const sortOption =
    sort === "rank" ? { rank: 1 } :
    sort === "score" ? { totalScore: -1 } :
    { createdAt: -1 };

  return paginate(College, query, {
    page,
    limit,
    sort: sortOption,
    populate: [{ path: "admin", select: "name email avatar" }],
  });
};

const updateCollege = async (collegeId, updateData, requesterId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  const requester = await User.findById(requesterId).select("role");
  const isOwner = college.admin && college.admin.toString() === requesterId.toString();
  const isPlatformAdmin = requester?.role === ROLES.PLATFORM_ADMIN;

  if (!isOwner && !isPlatformAdmin) {
    throw new ApiError(403, "You are not allowed to update this college");
  }

  Object.assign(college, updateData);
  await college.save();

  return college
    .populate("admin", "name email avatar")
    .populate("affiliatedStudents", "name avatar totalScore rank");
};

const updateCollegeLogo = async (collegeId, file, requesterId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  const requester = await User.findById(requesterId).select("role");
  const isOwner = college.admin && college.admin.toString() === requesterId.toString();
  const isPlatformAdmin = requester?.role === ROLES.PLATFORM_ADMIN;
  if (!isOwner && !isPlatformAdmin) {
    throw new ApiError(403, "You are not allowed to update this college logo");
  }

  const url = await uploadService.uploadImage(file, "colleges");
  college.logo = url;
  await college.save();

  return college;
};

const addStudentToCollege = async (collegeId, studentId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  const student = await User.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (!college.affiliatedStudents.some((id) => id.toString() === studentId.toString())) {
    college.affiliatedStudents.push(studentId);
  }

  student.college = college._id;
  if (!student.role) student.role = ROLES.STUDENT;

  await college.save();
  await student.save({ validateBeforeSave: false });

  return college
    .populate("admin", "name email avatar")
    .populate("affiliatedStudents", "name avatar totalScore rank");
};

const verifyCollege = async (collegeId) => {
  const college = await College.findByIdAndUpdate(
    collegeId,
    { isVerified: true },
    { new: true }
  )
    .populate("admin", "name email avatar")
    .populate("affiliatedStudents", "name avatar totalScore rank");

  if (!college) throw new ApiError(404, "College not found");
  return college;
};

module.exports = {
  createCollege,
  getCollegeById,
  getAllColleges,
  updateCollege,
  updateCollegeLogo,
  addStudentToCollege,
  verifyCollege,
};