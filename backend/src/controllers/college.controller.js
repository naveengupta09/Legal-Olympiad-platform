const collegeService = require("../services/college.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.createCollege(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, college, "College registered"));
});

const getAllColleges = asyncHandler(async (req, res) => {
  const result = await collegeService.getAllColleges(req.query);
  res.json(new ApiResponse(200, result, "Colleges fetched"));
});

const getCollegeById = asyncHandler(async (req, res) => {
  const college = await collegeService.getCollegeById(req.params.id);
  res.json(new ApiResponse(200, college, "College fetched"));
});

const updateCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.updateCollege(req.params.id, req.body, req.user._id);
  res.json(new ApiResponse(200, college, "College updated"));
});

const updateCollegeLogo = asyncHandler(async (req, res) => {
  const college = await collegeService.updateCollegeLogo(req.params.id, req.file, req.user._id);
  res.json(new ApiResponse(200, college, "Logo updated"));
});

const addStudent = asyncHandler(async (req, res) => {
  const college = await collegeService.addStudentToCollege(req.params.id, req.body.studentId);
  res.json(new ApiResponse(200, college, "Student added to college"));
});

const verifyCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.verifyCollege(req.params.id);
  res.json(new ApiResponse(200, college, "College verified"));
});

module.exports = { createCollege, getAllColleges, getCollegeById, updateCollege, updateCollegeLogo, addStudent, verifyCollege };