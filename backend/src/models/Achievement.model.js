const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    type: {
      type: String,
      enum: ["competition_win", "course_complete", "participation", "streak", "rank", "special"],
      required: true,
    },
    criteria: {
      field: { type: String },
      value: { type: Number },
    },
    points: { type: Number, default: 0 },
    badgeColor: { type: String, default: "#gold" },
    earnedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);