const mongoose = require("mongoose");
const slugify = require("slugify");
const { CONTENT_TYPES } = require("../config/constants");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: { type: String, unique: true },
    type: {
      type: String,
      enum: Object.values(CONTENT_TYPES),
      required: true,
    },
    body: { type: String, required: [true, "Content body is required"] },
    excerpt: { type: String, maxlength: 500 },
    coverImage: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    categories: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number, default: 5 },
    relatedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

contentSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

contentSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.body) {
    const words = this.body.split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

contentSchema.index({ type: 1, isPublished: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ publishedAt: -1 });

module.exports = mongoose.model("Content", contentSchema);