const podcastService = require("../services/podcast.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createPodcast = asyncHandler(async (req, res) => {
  const podcast = await podcastService.createPodcast(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, podcast, "Podcast created"));
});

const getAllPodcasts = asyncHandler(async (req, res) => {
  const result = await podcastService.getAllPodcasts(req.query);
  res.json(new ApiResponse(200, result, "Podcasts fetched"));
});

const getPodcastById = asyncHandler(async (req, res) => {
  const podcast = await podcastService.getPodcastById(req.params.id);
  res.json(new ApiResponse(200, podcast, "Podcast fetched"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const podcast = await podcastService.toggleLike(req.params.id, req.user._id);
  res.json(new ApiResponse(200, podcast, "Like toggled"));
});

const uploadAudio = asyncHandler(async (req, res) => {
  const podcast = await podcastService.uploadPodcastAudio(req.params.id, req.file);
  res.json(new ApiResponse(200, podcast, "Audio uploaded"));
});

const getFeaturedPodcasts = asyncHandler(async (req, res) => {
  const data = await podcastService.getFeaturedPodcasts(parseInt(req.query.limit) || 6);
  res.json(new ApiResponse(200, data, "Featured podcasts fetched"));
});

module.exports = { createPodcast, getAllPodcasts, getPodcastById, toggleLike, uploadAudio, getFeaturedPodcasts };