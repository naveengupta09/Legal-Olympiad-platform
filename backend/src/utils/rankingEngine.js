const User = require("../models/User.model");
const College = require("../models/College.model");
const Ranking = require("../models/Ranking.model");
const Competition = require("../models/Competition.model");
const { RANKING_PERIODS } = require("../config/constants");

const SCORE_WEIGHTS = {
  competitionWin: 100,
  competitionRunnerUp: 60,
  competitionParticipation: 10,
  courseCompletion: 20,
  webinarAttendance: 5,
};

const computeStudentScores = async () => {
  const competitions = await Competition.find({ status: "completed" }).select(
    "registrations"
  );

  const scoreMap = {};

  for (const comp of competitions) {
    for (const reg of comp.registrations) {
      const uid = reg.user.toString();
      if (!scoreMap[uid]) scoreMap[uid] = 0;

      if (reg.rank === 1) scoreMap[uid] += SCORE_WEIGHTS.competitionWin;
      else if (reg.rank === 2) scoreMap[uid] += SCORE_WEIGHTS.competitionRunnerUp;
      else scoreMap[uid] += SCORE_WEIGHTS.competitionParticipation;
    }
  }

  return scoreMap;
};

const recomputeStudentRankings = async (period = RANKING_PERIODS.ALL_TIME) => {
  const scoreMap = await computeStudentScores();

  const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);

  const bulkOps = sorted.map(([userId, score], index) => ({
    updateOne: {
      filter: { entity: userId, entityType: "student", period },
      update: {
        $set: {
          rank: index + 1,
          score,
          entityModel: "User",
          calculatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulkOps.length) await Ranking.bulkWrite(bulkOps);

  await User.bulkWrite(
    sorted.map(([userId, score], index) => ({
      updateOne: {
        filter: { _id: userId },
        update: { $set: { totalScore: score, rank: index + 1 } },
      },
    }))
  );

  return sorted.length;
};

const recomputeCollegeRankings = async (period = RANKING_PERIODS.ALL_TIME) => {
  const users = await User.find({ college: { $ne: null } }).select(
    "college totalScore"
  );

  const collegeScoreMap = {};
  for (const user of users) {
    const cid = user.college.toString();
    if (!collegeScoreMap[cid]) collegeScoreMap[cid] = 0;
    collegeScoreMap[cid] += user.totalScore || 0;
  }

  const sorted = Object.entries(collegeScoreMap).sort((a, b) => b[1] - a[1]);

  const bulkRanking = sorted.map(([collegeId, score], index) => ({
    updateOne: {
      filter: { entity: collegeId, entityType: "college", period },
      update: {
        $set: {
          rank: index + 1,
          score,
          entityModel: "College",
          calculatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulkRanking.length) await Ranking.bulkWrite(bulkRanking);

  await College.bulkWrite(
    sorted.map(([collegeId, score], index) => ({
      updateOne: {
        filter: { _id: collegeId },
        update: { $set: { totalScore: score, rank: index + 1 } },
      },
    }))
  );

  return sorted.length;
};

module.exports = {
  recomputeStudentRankings,
  recomputeCollegeRankings,
  SCORE_WEIGHTS,
};