const competitionService = require("../services/competition.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createCompetition = asyncHandler(async (req, res) => {
  const competition = await competitionService.createCompetition(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, competition, "Competition created"));
});

const getAllCompetitions = asyncHandler(async (req, res) => {
  const result = await competitionService.getAllCompetitions(req.query);
  res.json(new ApiResponse(200, result, "Competitions fetched"));
});

const getCompetitionById = asyncHandler(async (req, res) => {
  const competition = await competitionService.getCompetitionById(req.params.id);
  res.json(new ApiResponse(200, competition, "Competition fetched"));
});

const registerForCompetition = asyncHandler(async (req, res) => {
  const competition = await competitionService.registerForCompetition(req.params.id, req.user._id);
  res.json(new ApiResponse(200, competition, "Registered successfully"));
});

const updateCompetition = asyncHandler(async (req, res) => {
  const competition = await competitionService.updateCompetition(req.params.id, req.body, req.user._id);
  res.json(new ApiResponse(200, competition, "Competition updated"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const competition = await competitionService.updateCompetitionStatus(
    req.params.id, req.body.status, req.user._id
  );
  res.json(new ApiResponse(200, competition, "Status updated"));
});

const submitResults = asyncHandler(async (req, res) => {
  const competition = await competitionService.submitResults(
    req.params.id, req.body.results, req.user._id
  );
  res.json(new ApiResponse(200, competition, "Results submitted"));
});

module.exports = {
  createCompetition, getAllCompetitions, getCompetitionById,
  registerForCompetition, updateCompetition, updateStatus, submitResults,
};