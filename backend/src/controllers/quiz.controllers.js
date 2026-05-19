const quizService = require("../services/quiz.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, quiz, "Quiz created"));
});

const getAllQuizzes = asyncHandler(async (req, res) => {
  const result = await quizService.getAllQuizzes(req.query);
  res.json(new ApiResponse(200, result, "Quizzes fetched"));
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizForStudent(req.params.id, req.user._id);
  res.json(new ApiResponse(200, quiz, "Quiz fetched"));
});

const startAttempt = asyncHandler(async (req, res) => {
  const attempt = await quizService.startAttempt(req.params.id, req.user._id);
  res.json(new ApiResponse(200, attempt, "Attempt started"));
});

const recordTabSwitch = asyncHandler(async (req, res) => {
  const result = await quizService.recordTabSwitch(req.params.id, req.user._id);
  res.json(new ApiResponse(200, result, result.disqualified ? "Disqualified" : "Warning recorded"));
});

const submitQuiz = asyncHandler(async (req, res) => {
  const result = await quizService.submitQuiz(req.params.id, req.user._id, req.body.answers);
  res.json(new ApiResponse(200, result, "Quiz submitted successfully"));
});

const getQuizResults = asyncHandler(async (req, res) => {
  const results = await quizService.getQuizResults(req.params.id);
  res.json(new ApiResponse(200, results, "Results fetched"));
});

const getMyResult = asyncHandler(async (req, res) => {
  const result = await quizService.getMyResult(req.params.id, req.user._id);
  res.json(new ApiResponse(200, result, "Your result fetched"));
});

module.exports = {
  createQuiz, getAllQuizzes, getQuiz, startAttempt,
  recordTabSwitch, submitQuiz, getQuizResults, getMyResult,
};