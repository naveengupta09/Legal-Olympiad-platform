const mongoose = require("mongoose");
const slugify = require("slugify");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      unique: true,
      trim: true,
    },
    slug: { type: String, unique: true },
    logo: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    website: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    description: { type: String, maxlength: 1000 },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    affiliatedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    totalScore: { type: Number, default: 0 },
    rank: { type: Number, default: null },
    participationCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    stats: {
      totalStudents: { type: Number, default: 0 },
      competitionsParticipated: { type: Number, default: 0 },
      awardsWon: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

collegeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("College", collegeSchema);