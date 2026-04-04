const College = require("../models/College.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const uploadService = require("./upload.service");

const createCollege = async (data, adminId) => {
  const exists = await College.findOne({ name: data.name });
  if (exists) throw new ApiError(409, "College already registered");

  const college = await College.create({ ...data, admin: adminId });

  await User.findByIdAndUpdate(adminId, {
    college: college._id,
    role: "college_admin",
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

const updateCollege = async (collegeId, updateData, requesterId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  const requester = await User.findById(requesterId);
  const isAdmin = requester.role === "platform_admin";
  const isCollegeAdmin = college.admin.toString() === requesterId.toString();

  if (!isAdmin && !isCollegeAdmin) {
    throw new ApiError(403, "Not authorized to update this college");
  }

  const allowed = ["description", "website", "email", "phone", "location"];
  const filtered = {};
  for (const key of allowed) {
    if (updateData[key] !== undefined) filtered[key] = updateData[key];
  }

  return College.findByIdAndUpdate(collegeId, filtered, { new: true, runValidators: true });
};

const updateCollegeLogo = async (collegeId, file) => {
  const url = await uploadService.uploadImage(file, "colleges");
  return College.findByIdAndUpdate(collegeId, { logo: url }, { new: true });
};

const getAllColleges = async (queryParams) => {
  const { page, limit, search, sort, verified } = queryParams;

  const query = { isActive: true };
  if (search) query.name = { $regex: search, $options: "i" };
  if (verified !== undefined) query.isVerified = verified === "true";

  const sortOption =
    sort === "rank" ? { rank: 1 } :
    sort === "score" ? { totalScore: -1 } :
    sort === "students" ? { "stats.totalStudents": -1 } :
    { createdAt: -1 };

  return paginate(College, query, {
    page,
    limit,
    sort: sortOption,
    select: "name slug logo location totalScore rank stats isVerified",
  });
};

const addStudentToCollege = async (collegeId, studentId) => {
  const college = await College.findById(collegeId);
  if (!college) throw new ApiError(404, "College not found");

  if (college.affiliatedStudents.includes(studentId)) {
    throw new ApiError(409, "Student already affiliated with this college");
  }

  college.affiliatedStudents.push(studentId);
  college.stats.totalStudents = college.affiliatedStudents.length;
  await college.save();

  await User.findByIdAndUpdate(studentId, { college: collegeId });
  return college;
};

const verifyCollege = async (collegeId) => {
  return College.findByIdAndUpdate(collegeId, { isVerified: true }, { new: true });
};

module.exports = {
  createCollege,
  getCollegeById,
  updateCollege,
  updateCollegeLogo,
  getAllColleges,
  addStudentToCollege,
  verifyCollege,
};