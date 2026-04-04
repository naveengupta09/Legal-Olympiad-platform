const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
  resources: [{ name: String, url: String }],
  isPreview: { type: Boolean, default: false },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [lessonSchema],
});

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  completedLessons: [String],
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  score: { type: Number, default: 0 },
  certificateUrl: { type: String },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    coverImage: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["constitutional_law", "criminal_law", "civil_law", "corporate_law", "international_law", "other"],
    },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    language: { type: String, default: "English" },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    modules: [moduleSchema],
    enrollments: [enrollmentSchema],
    totalDuration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    certificateProvided: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

courseSchema.virtual("enrollmentCount").get(function () {
  return this.enrollments.length;
});

module.exports = mongoose.model("Course", courseSchema);