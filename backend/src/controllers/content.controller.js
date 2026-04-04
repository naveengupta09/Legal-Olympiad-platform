const contentService = require("../services/content.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createContent = asyncHandler(async (req, res) => {
  const content = await contentService.createContent(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, content, "Content created"));
});

const getAllContent = asyncHandler(async (req, res) => {
  const result = await contentService.getAllContent(req.query);
  res.json(new ApiResponse(200, result, "Content fetched"));
});

const getContentById = asyncHandler(async (req, res) => {
  const content = await contentService.getContentById(req.params.id);
  res.json(new ApiResponse(200, content, "Content fetched"));
});

const getContentBySlug = asyncHandler(async (req, res) => {
  const content = await contentService.getContentBySlug(req.params.slug);
  res.json(new ApiResponse(200, content, "Content fetched"));
});

const updateContent = asyncHandler(async (req, res) => {
  const content = await contentService.updateContent(req.params.id, req.body, req.user._id);
  res.json(new ApiResponse(200, content, "Content updated"));
});

const deleteContent = asyncHandler(async (req, res) => {
  await contentService.deleteContent(req.params.id, req.user._id, req.user.role);
  res.json(new ApiResponse(200, null, "Content deleted"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const content = await contentService.toggleLike(req.params.id, req.user._id);
  res.json(new ApiResponse(200, content, "Like toggled"));
});

const uploadCoverImage = asyncHandler(async (req, res) => {
  const content = await contentService.uploadCoverImage(req.params.id, req.file);
  res.json(new ApiResponse(200, content, "Cover image uploaded"));
});

module.exports = {
  createContent, getAllContent, getContentById, getContentBySlug,
  updateContent, deleteContent, toggleLike, uploadCoverImage,
};