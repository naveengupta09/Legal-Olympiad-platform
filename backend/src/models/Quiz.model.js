const mongoose = require("mongoose");

// ── Option sub-document ───────────────────────────────────────────────────────
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false, select: false }, // hidden from students
});

// ── Question sub-document ─────────────────────────────────────────────────────
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["mcq", "true_false", "short_answer"], default: "mcq" },
  options: [optionSchema],
  explanation: { type: String, default: "" }, // shown after quiz ends
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
});

// ── Attempt sub-document ──────────────────────────────────────────────────────
const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOption: { type: mongoose.Schema.Types.ObjectId, default: null },
  shortAnswer: { type: String, default: "" },
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // seconds on this question
});

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  rank: { type: Number, default: null },
  timeTaken: { type: Number, default: 0 }, // seconds
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  isSubmitted: { type: Boolean, default: false },
  tabSwitches: { type: Number, default: 0 },        // anti-cheat
  isDisqualified: { type: Boolean, default: false },
  warningCount: { type: Number, default: 0 },
});

// ── Main Quiz schema ──────────────────────────────────────────────────────────
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    competition: { type: mongoose.Schema.Types.ObjectId, ref: "Competition" }, // optional link
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },      // optional link
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    questions: [questionSchema],

    // Timing
    durationMinutes: { type: Number, required: true, default: 30 },
    startsAt: { type: Date, default: null },  // null = anytime
    endsAt: { type: Date, default: null },

    // Rules
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    showResultAfter: { type: Boolean, default: true },  // show result immediately?
    allowReview: { type: Boolean, default: false },  // can user review answers?
    passingPercentage: { type: Number, default: 40 },
    maxAttempts: { type: Number, default: 1 },

    // Anti-cheat
    enableAntiCheat: { type: Boolean, default: true },
    maxTabSwitches: { type: Number, default: 3 },    // disqualify after N switches

    // Access
    isPublished: { type: Boolean, default: false },
    eligibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // empty = all

    // Attempts
    attempts: [attemptSchema],

    totalMarks: { type: Number, default: 0 }, // computed on save
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// ── Pre-save: compute totalMarks ──────────────────────────────────────────────
quizSchema.pre("save", function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  next();
});

// ── Virtuals ──────────────────────────────────────────────────────────────────
quizSchema.virtual("attemptCount").get(function () {
  return this.attempts.length;
});

quizSchema.virtual("averageScore").get(function () {
  if (!this.attempts.length) return 0;
  const submitted = this.attempts.filter((a) => a.isSubmitted);
  if (!submitted.length) return 0;
  return Math.round(submitted.reduce((s, a) => s + a.percentage, 0) / submitted.length);
});

module.exports = mongoose.model("Quiz", quizSchema);