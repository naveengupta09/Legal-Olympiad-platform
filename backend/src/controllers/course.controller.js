const courseService = require("../services/course.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, course, "Course created"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const result = await courseService.getAllCourses(req.query);
  res.json(new ApiResponse(200, result, "Courses fetched"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  res.json(new ApiResponse(200, course, "Course fetched"));
});

const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await courseService.enrollInCourse(req.params.id, req.user._id);
  res.json(new ApiResponse(200, course, "Enrolled successfully"));
});

const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await courseService.updateProgress(
    req.params.id, req.user._id, req.body.lessonId
  );
  res.json(new ApiResponse(200, enrollment, "Progress updated"));
});

module.exports = { createCourse, getAllCourses, getCourseById, enrollInCourse, updateProgress };