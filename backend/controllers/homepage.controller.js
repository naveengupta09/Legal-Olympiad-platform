const Content = require("../models/Content.model");
const Webinar = require("../models/Webinar.model");
const Competition = require("../models/Competition.model");
const Podcast = require("../models/Podcast.model");
const College = require("../models/College.model");
const User = require("../models/User.model");
const rankingService = require("../services/ranking.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getCache, setCache } = require("../config/redis");

const getHomepageFeed = asyncHandler(async (req, res) => {
  const cacheKey = "homepage:feed";
  const cached = await getCache(cacheKey);
  if (cached) return res.json(new ApiResponse(200, cached, "Homepage feed fetched"));

  const [
    featuredBlogs,
    latestNews,
    latestUpdates,
    upcomingWebinars,
    featuredPodcasts,
    upcomingCompetitions,
    topStudents,
    topColleges,
    newStudents,
    newColleges,
  ] = await Promise.all([
    Content.find({ type: "blog", isPublished: true, isFeatured: true })
      .sort({ publishedAt: -1 })
      .limit(4)
      .populate("author", "name avatar")
      .select("title slug excerpt coverImage author tags publishedAt readTime views"),

    Content.find({ type: "news", isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate("author", "name avatar")
      .select("title slug excerpt coverImage author publishedAt"),

    Content.find({ type: "update", isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select("title slug excerpt publishedAt"),

    Webinar.find({ status: "upcoming", scheduledAt: { $gte: new Date() } })
      .sort({ scheduledAt: 1 })
      .limit(4)
      .populate("host", "name avatar")
      .select("title description coverImage host scheduledAt durationMinutes tags certificateProvided"),

    Podcast.find({ isPublished: true, isFeatured: true })
      .sort({ publishedAt: -1 })
      .limit(4)
      .populate("host", "name avatar")
      .select("title coverImage host duration episodeNumber plays publishedAt"),

    Competition.find({ isPublished: true, status: { $in: ["upcoming", "registration_open"] } })
      .sort({ startDate: 1 })
      .limit(4)
      .populate("organizer", "name")
      .select("title type status coverImage startDate registrationDeadline entryFee prizePool isFeatured"),

    User.find({ isActive: true, rank: { $lte: 10, $ne: null } })
      .sort({ rank: 1 })
      .limit(10)
      .populate("college", "name logo")
      .select("name avatar college totalScore rank"),

    College.find({ isActive: true, rank: { $lte: 10, $ne: null } })
      .sort({ rank: 1 })
      .limit(10)
      .select("name logo location totalScore rank stats"),

    User.find({ isActive: true, role: "student" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("college", "name")
      .select("name avatar college createdAt"),

    College.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("name logo location stats createdAt"),
  ]);

  const stats = {
    totalStudents: await User.countDocuments({ role: "student", isActive: true }),
    totalColleges: await College.countDocuments({ isActive: true }),
    totalCompetitions: await Competition.countDocuments({ isPublished: true }),
    totalWebinars: await Webinar.countDocuments(),
  };

  const feed = {
    stats,
    featuredBlogs,
    latestNews,
    latestUpdates,
    upcomingWebinars,
    featuredPodcasts,
    upcomingCompetitions,
    rankings: { topStudents, topColleges },
    recentParticipants: { newStudents, newColleges },
  };

  await setCache(cacheKey, feed, 120);
  res.json(new ApiResponse(200, feed, "Homepage feed fetched"));
});

const getPlatformStats = asyncHandler(async (req, res) => {
  const cacheKey = "homepage:stats";
  const cached = await getCache(cacheKey);
  if (cached) return res.json(new ApiResponse(200, cached, "Stats fetched"));

  const stats = {
    totalStudents: await User.countDocuments({ role: "student", isActive: true }),
    totalColleges: await College.countDocuments({ isActive: true }),
    totalCompetitions: await Competition.countDocuments({ isPublished: true }),
    totalWebinars: await Webinar.countDocuments(),
    totalContent: await Content.countDocuments({ isPublished: true }),
    totalPodcasts: await Podcast.countDocuments({ isPublished: true }),
  };

  await setCache(cacheKey, stats, 300);
  res.json(new ApiResponse(200, stats, "Stats fetched"));
});

module.exports = { getHomepageFeed, getPlatformStats };