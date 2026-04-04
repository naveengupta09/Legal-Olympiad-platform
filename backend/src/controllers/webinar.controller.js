const webinarService = require("../services/webinar.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createWebinar = asyncHandler(async (req, res) => {
  const webinar = await webinarService.createWebinar(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, webinar, "Webinar created"));
});

const getAllWebinars = asyncHandler(async (req, res) => {
  const result = await webinarService.getAllWebinars(req.query);
  res.json(new ApiResponse(200, result, "Webinars fetched"));
});

const getWebinarById = asyncHandler(async (req, res) => {
  const webinar = await webinarService.getWebinarById(req.params.id);
  res.json(new ApiResponse(200, webinar, "Webinar fetched"));
});

const registerForWebinar = asyncHandler(async (req, res) => {
  const webinar = await webinarService.registerForWebinar(req.params.id, req.user._id);
  res.json(new ApiResponse(200, webinar, "Registered for webinar"));
});

const markAttendance = asyncHandler(async (req, res) => {
  const webinar = await webinarService.markAttendance(req.params.id, req.body.userId);
  res.json(new ApiResponse(200, webinar, "Attendance marked"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const webinar = await webinarService.updateWebinarStatus(req.params.id, req.body.status);
  res.json(new ApiResponse(200, webinar, "Status updated"));
});

const getUpcomingWebinars = asyncHandler(async (req, res) => {
  const data = await webinarService.getUpcomingWebinars(parseInt(req.query.limit) || 5);
  res.json(new ApiResponse(200, data, "Upcoming webinars fetched"));
});

module.exports = {
  createWebinar, getAllWebinars, getWebinarById, registerForWebinar,
  markAttendance, updateStatus, getUpcomingWebinars,
};