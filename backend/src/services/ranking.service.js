const Ranking = require("../models/Ranking.model");
const User = require("../models/User.model");
const College = require("../models/College.model");
const ApiError = require("../utils/ApiError");
const { getCache, setCache } = require("../config/redis");
const { recomputeStudentRankings, recomputeCollegeRankings } = require("../utils/rankingEngine");
const { RANKING_PERIODS } = require("../config/constants");

const getStudentLeaderboard = async ({ page = 1, limit = 20, period = RANKING_PERIODS.ALL_TIME, college }) => {
  const cacheKey = `rankings:students:${period}:${college || "all"}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const matchQuery = { entityType: "student", period };
  let result;

  if (college) {
    const students = await User.find({ college }).select("_id");
    const ids = students.map((s) => s._id);
    matchQuery.entity = { $in: ids };
  }

  const rankings = await Ranking.find(matchQuery)
    .sort({ rank: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate({
      path: "entity",
      select: "name avatar college totalScore rank",
      populate: { path: "college", select: "name logo" },
    });

  const total = await Ranking.countDocuments(matchQuery);

  result = {
    data: rankings,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 600);
  return result;
};

const getCollegeLeaderboard = async ({ page = 1, limit = 20, period = RANKING_PERIODS.ALL_TIME }) => {
  const cacheKey = `rankings:colleges:${period}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const rankings = await Ranking.find({ entityType: "college", period })
    .sort({ rank: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate({
      path: "entity",
      select: "name logo location totalScore rank stats",
    });

  const total = await Ranking.countDocuments({ entityType: "college", period });

  const result = {
    data: rankings,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 600);
  return result;
};

const getUserRanking = async (userId, period = RANKING_PERIODS.ALL_TIME) => {
  const ranking = await Ranking.findOne({ entity: userId, entityType: "student", period })
    .populate("entity", "name avatar totalScore");
  if (!ranking) throw new ApiError(404, "Ranking not found for this user");
  return ranking;
};

const triggerRecompute = async () => {
  const [students, colleges] = await Promise.all([
    recomputeStudentRankings(),
    recomputeCollegeRankings(),
  ]);
  return { studentsUpdated: students, collegesUpdated: colleges };
};

const getTopStudents = async (limit = 10) => {
  const cacheKey = `rankings:top_students:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await User.find({ isActive: true, rank: { $ne: null } })
    .sort({ rank: 1 })
    .limit(limit)
    .populate("college", "name logo")
    .select("name avatar college totalScore rank");

  await setCache(cacheKey, data, 300);
  return data;
};

const getTopColleges = async (limit = 10) => {
  const cacheKey = `rankings:top_colleges:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await College.find({ isActive: true, rank: { $ne: null } })
    .sort({ rank: 1 })
    .limit(limit)
    .select("name logo location totalScore rank stats");

  await setCache(cacheKey, data, 300);
  return data;
};

module.exports = {
  getStudentLeaderboard,
  getCollegeLeaderboard,
  getUserRanking,
  triggerRecompute,
  getTopStudents,
  getTopColleges,
};