const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["competition", "webinar", "course", "ranking", "achievement", "system", "general"],
      default: "general",
    },
    relatedEntity: { type: mongoose.Schema.Types.ObjectId },
    relatedModel: { type: String },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    actionUrl: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);