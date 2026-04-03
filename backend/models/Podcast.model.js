const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    coverImage: { type: String, default: "" },
    audioUrl: { type: String, required: true },
    duration: { type: Number, default: 0 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guests: [
      {
        name: { type: String },
        designation: { type: String },
        avatar: { type: String },
      },
    ],
    episodeNumber: { type: Number },
    season: { type: Number, default: 1 },
    transcript: { type: String },
    tags: [{ type: String }],
    plays: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    externalLinks: {
      spotify: { type: String },
      apple: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

podcastSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

module.exports = mongoose.model("Podcast", podcastSchema);