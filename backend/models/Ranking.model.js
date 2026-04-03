const mongoose = require("mongoose");
const { RANKING_PERIODS } = require("../config/constants");

const rankingSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["student", "college"],
      required: true,
    },
    entity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      required: true,
      enum: ["User", "College"],
    },
    period: {
      type: String,
      enum: Object.values(RANKING_PERIODS),
      required: true,
    },
    periodLabel: { type: String },
    rank: { type: Number, required: true },
    previousRank: { type: Number, default: null },
    score: { type: Number, required: true, default: 0 },
    breakdown: {
      competitionScore: { type: Number, default: 0 },
      courseScore: { type: Number, default: 0 },
      activityScore: { type: Number, default: 0 },
      participationBonus: { type: Number, default: 0 },
    },
    participationCount: { type: Number, default: 0 },
    winCount: { type: Number, default: 0 },
    calculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

rankingSchema.index({ entityType: 1, period: 1, rank: 1 });
rankingSchema.index({ entity: 1, period: 1 }, { unique: true });

module.exports = mongoose.model("Ranking", rankingSchema);