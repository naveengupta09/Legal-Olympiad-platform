const rankingService = require("../services/ranking.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getStudentLeaderboard = asyncHandler(async (req, res) => {
  const result = await rankingService.getStudentLeaderboard(req.query);
  res.json(new ApiResponse(200, result, "Student leaderboard fetched"));
});

const getCollegeLeaderboard = asyncHandler(async (req, res) => {
  const result = await rankingService.getCollegeLeaderboard(req.query);
  res.json(new ApiResponse(200, result, "College leaderboard fetched"));
});

const getMyRanking = asyncHandler(async (req, res) => {
  const ranking = await rankingService.getUserRanking(req.user._id, req.query.period);
  res.json(new ApiResponse(200, ranking, ranking ? "Your ranking fetched" : "Ranking not available yet"));
});

const getUserRanking = asyncHandler(async (req, res) => {
  const ranking = await rankingService.getUserRanking(req.params.userId, req.query.period);
  res.json(new ApiResponse(200, ranking, ranking ? "Ranking fetched" : "Ranking not available yet"));
});

const triggerRecompute = asyncHandler(async (req, res) => {
  const result = await rankingService.triggerRecompute();
  res.json(new ApiResponse(200, result, "Rankings recomputed"));
});

const getTopStudents = asyncHandler(async (req, res) => {
  const data = await rankingService.getTopStudents(parseInt(req.query.limit) || 10);
  res.json(new ApiResponse(200, data, "Top students fetched"));
});

const getTopColleges = asyncHandler(async (req, res) => {
  const data = await rankingService.getTopColleges(parseInt(req.query.limit) || 10);
  res.json(new ApiResponse(200, data, "Top colleges fetched"));
});

module.exports = {
  getStudentLeaderboard, getCollegeLeaderboard, getMyRanking,
  getUserRanking, triggerRecompute, getTopStudents, getTopColleges,
};