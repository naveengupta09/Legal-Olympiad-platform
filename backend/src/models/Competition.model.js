const mongoose = require("mongoose");
const { COMPETITION_STATUS } = require("../config/constants");

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  maxScore: { type: Number, default: 100 },
  isCompleted: { type: Boolean, default: false },
});

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  registeredAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["pending", "paid", "waived"], default: "pending" },
  totalScore: { type: Number, default: 0 },
  rank: { type: Number, default: null },
  isQualified: { type: Boolean, default: false },
});

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["moot_court", "quiz", "essay", "debate", "client_counselling", "negotiation", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(COMPETITION_STATUS),
      default: COMPETITION_STATUS.UPCOMING,
    },
    coverImage: { type: String, default: "" },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    eligibility: {
      minYear: { type: Number, default: 1 },
      maxYear: { type: Number, default: 5 },
      allowedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
      description: { type: String },
    },
    maxParticipants: { type: Number, default: null },
    entryFee: { type: Number, default: 0 },
    prizePool: { type: Number, default: 0 },
    prizes: [
      {
        position: { type: String },
        amount: { type: Number },
        description: { type: String },
      },
    ],
    rounds: [roundSchema],
    registrations: [registrationSchema],
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    scoringCriteria: { type: String },
    rules: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

competitionSchema.virtual("participantCount").get(function () {
  return this.registrations.length;
});

competitionSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model("Competition", competitionSchema);