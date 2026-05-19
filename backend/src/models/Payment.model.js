const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // What was purchased
    entityType: { type: String, enum: ["competition", "course", "subscription"], required: true },
    entity: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "entityModel" },
    entityModel: { type: String, required: true, enum: ["Competition", "Course"] },

    // Razorpay fields
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    amount: { type: Number, required: true },  // in paise (INR * 100)
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
    receipt: { type: String },
    notes: { type: mongoose.Schema.Types.Mixed, default: {} },

    paidAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    refundId: { type: String, default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);