const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const notificationService = require("./notification.service");
const emailService = require("./email.service");

// ── Razorpay instance ─────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Create order ──────────────────────────────────────────────────────────────
const createOrder = async ({ userId, entityType, entityId, entityModel, amount, notes = {} }) => {
  // amount in INR — we convert to paise
  const amountPaise = Math.round(amount * 100);

  const receipt = `rcpt_${entityType}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: { userId: userId.toString(), entityType, entityId: entityId.toString(), ...notes },
  });

  // Store pending payment record
  const payment = await Payment.create({
    user: userId,
    entityType,
    entity: entityId,
    entityModel,
    razorpayOrderId: order.id,
    amount: amountPaise,
    receipt,
    notes,
    status: "created",
  });

  return {
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentId: payment._id,
  };
};

// ── Verify payment signature ──────────────────────────────────────────────────
const verifyAndCapture = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId }) => {
  // 1. Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Payment verification failed. Signature mismatch.");
  }

  // 2. Find the payment record
  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) throw new ApiError(404, "Payment record not found");
  if (payment.status === "paid") throw new ApiError(409, "Payment already processed");

  // 3. Fetch payment details from Razorpay
  const rzpPayment = await razorpay.payments.fetch(razorpayPaymentId);
  if (rzpPayment.status !== "captured" && rzpPayment.status !== "authorized") {
    payment.status = "failed";
    payment.failedAt = new Date();
    await payment.save();
    throw new ApiError(400, "Payment not captured by Razorpay");
  }

  // 4. Mark as paid
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "paid";
  payment.paidAt = new Date();
  await payment.save();

  // 5. Fulfil the purchase
  await fulfil(payment);

  return payment;
};

// ── Fulfil purchase based on entityType ───────────────────────────────────────
const fulfil = async (payment) => {
  const { entityType, entity: entityId, user: userId } = payment;

  if (entityType === "competition") {
    const Competition = require("../models/Competition.model");
    const comp = await Competition.findById(entityId);
    if (comp) {
      const alreadyRegistered = comp.registrations.some(
        (r) => r.user.toString() === userId.toString()
      );
      if (!alreadyRegistered) {
        comp.registrations.push({ user: userId, paymentStatus: "paid" });
        await comp.save();
      }
    }
  }

  if (entityType === "course") {
    const Course = require("../models/Course.model");
    const course = await Course.findById(entityId);
    if (course) {
      const alreadyEnrolled = course.enrollments.some(
        (e) => e.user.toString() === userId.toString()
      );
      if (!alreadyEnrolled) {
        course.enrollments.push({ user: userId });
        await course.save();
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: entityId } });
      }
    }
  }

  // Send notification
  await notificationService.create({
    recipient: userId,
    title: "Payment Successful ✅",
    message: `Your payment of ₹${payment.amount / 100} has been received. You're all set!`,
    type: "general",
    relatedEntity: entityId,
  });
};

// ── Refund ────────────────────────────────────────────────────────────────────
const refundPayment = async (paymentId, userId) => {
  const payment = await Payment.findOne({ _id: paymentId, user: userId });
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.status !== "paid") throw new ApiError(400, "Only paid payments can be refunded");

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: payment.amount,
    notes: { reason: "User requested refund" },
  });

  payment.status = "refunded";
  payment.refundedAt = new Date();
  payment.refundId = refund.id;
  await payment.save();

  return refund;
};

// ── Get user payment history ──────────────────────────────────────────────────
const getUserPayments = async (userId) => {
  return Payment.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
};

// ── Webhook handler (called from route) ───────────────────────────────────────
const handleWebhook = async (body, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const { event, payload } = body;

  if (event === "payment.captured") {
    const rzpPaymentId = payload.payment.entity.id;
    const orderId = payload.payment.entity.order_id;

    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (payment && payment.status !== "paid") {
      payment.razorpayPaymentId = rzpPaymentId;
      payment.status = "paid";
      payment.paidAt = new Date();
      await payment.save();
      await fulfil(payment);
    }
  }

  if (event === "payment.failed") {
    const orderId = payload.payment.entity.order_id;
    await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status: "failed", failedAt: new Date() }
    );
  }
};

module.exports = {
  createOrder, verifyAndCapture, refundPayment,
  getUserPayments, handleWebhook,
};