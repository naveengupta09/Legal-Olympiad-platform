const Podcast = require("../models/Podcast.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const uploadService = require("./upload.service");

const createPodcast = async (data, hostId) => {
  return Podcast.create({ ...data, host: hostId });
};

const getPodcastById = async (podcastId) => {
  const podcast = await Podcast.findByIdAndUpdate(
    podcastId,
    { $inc: { plays: 1 } },
    { new: true }
  ).populate("host", "name avatar");
  if (!podcast) throw new ApiError(404, "Podcast not found");
  return podcast;
};

const getAllPodcasts = async (queryParams) => {
  const { page, limit, featured, tag, search } = queryParams;

  const query = { isPublished: true };
  if (featured === "true") query.isFeatured = true;
  if (tag) query.tags = tag;
  if (search) query.title = { $regex: search, $options: "i" };

  return paginate(Podcast, query, {
    page,
    limit,
    sort: { publishedAt: -1 },
    populate: [{ path: "host", select: "name avatar" }],
    select: "title slug coverImage host duration episodeNumber season plays tags publishedAt isFeatured externalLinks",
  });
};

const toggleLike = async (podcastId, userId) => {
  const podcast = await Podcast.findById(podcastId);
  if (!podcast) throw new ApiError(404, "Podcast not found");

  const hasLiked = podcast.likes.includes(userId);
  const update = hasLiked
    ? { $pull: { likes: userId } }
    : { $addToSet: { likes: userId } };

  return Podcast.findByIdAndUpdate(podcastId, update, { new: true });
};

const uploadPodcastAudio = async (podcastId, file) => {
  const url = await uploadService.uploadAudio(file);
  return Podcast.findByIdAndUpdate(podcastId, { audioUrl: url }, { new: true });
};

const getFeaturedPodcasts = async (limit = 6) => {
  return Podcast.find({ isPublished: true, isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("host", "name avatar")
    .select("title coverImage host duration episodeNumber plays publishedAt");
};

module.exports = {
  createPodcast,
  getPodcastById,
  getAllPodcasts,
  toggleLike,
  uploadPodcastAudio,
  getFeaturedPodcasts,
};