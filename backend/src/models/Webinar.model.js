const mongoose = require("mongoose");
const { WEBINAR_STATUS } = require("../config/constants");

const webinarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: "" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    speakers: [
      {
        name: { type: String, required: true },
        designation: { type: String },
        avatar: { type: String },
        bio: { type: String },
      },
    ],
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    status: {
      type: String,
      enum: Object.values(WEBINAR_STATUS),
      default: WEBINAR_STATUS.UPCOMING,
    },
    platformLink: { type: String },
    meetingId: { type: String },
    passcode: { type: String },
    recordingUrl: { type: String },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    maxAttendees: { type: Number, default: null },
    registrations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        registeredAt: { type: Date, default: Date.now },
        attended: { type: Boolean, default: false },
      },
    ],
    tags: [{ type: String }],
    topics: [{ type: String }],
    certificateProvided: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

webinarSchema.virtual("registrationCount").get(function () {
  return this.registrations.length;
});

webinarSchema.index({ scheduledAt: 1, status: 1 });

module.exports = mongoose.model("Webinar", webinarSchema);