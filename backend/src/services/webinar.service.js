const Webinar = require("../models/Webinar.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const notificationService = require("./notification.service");

const createWebinar = async (data, hostId) => {
  return Webinar.create({ ...data, host: hostId });
};

const getWebinarById = async (webinarId) => {
  const webinar = await Webinar.findById(webinarId)
    .populate("host", "name avatar")
    .populate("registrations.user", "name avatar");
  if (!webinar) throw new ApiError(404, "Webinar not found");
  return webinar;
};

const getAllWebinars = async (queryParams) => {
  const { page, limit, status, featured, tag, upcoming } = queryParams;

  const query = {};
  if (status) query.status = status;
  if (featured === "true") query.isFeatured = true;
  if (tag) query.tags = tag;
  if (upcoming === "true") {
    query.scheduledAt = { $gte: new Date() };
    query.status = "upcoming";
  }

  return paginate(Webinar, query, {
    page,
    limit,
    sort: { scheduledAt: 1 },
    populate: [{ path: "host", select: "name avatar" }],
    select: "title description coverImage host scheduledAt durationMinutes status isFeatured tags certificateProvided",
  });
};

const registerForWebinar = async (webinarId, userId) => {
  const webinar = await Webinar.findById(webinarId);
  if (!webinar) throw new ApiError(404, "Webinar not found");

  if (webinar.status !== "upcoming") {
    throw new ApiError(400, "Registration is closed for this webinar");
  }

  const alreadyRegistered = webinar.registrations.some(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyRegistered) throw new ApiError(409, "Already registered");

  if (webinar.maxAttendees && webinar.registrations.length >= webinar.maxAttendees) {
    throw new ApiError(400, "Webinar is full");
  }

  webinar.registrations.push({ user: userId });
  await webinar.save();

  await notificationService.create({
    recipient: userId,
    title: "Webinar Registration Confirmed",
    message: `You're registered for "${webinar.title}" on ${new Date(webinar.scheduledAt).toDateString()}`,
    type: "webinar",
    relatedEntity: webinar._id,
    relatedModel: "Webinar",
  });

  return webinar;
};

const markAttendance = async (webinarId, userId) => {
  const webinar = await Webinar.findById(webinarId);
  if (!webinar) throw new ApiError(404, "Webinar not found");

  const reg = webinar.registrations.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (!reg) throw new ApiError(404, "Registration not found");

  reg.attended = true;
  await webinar.save();
  return webinar;
};

const updateWebinarStatus = async (webinarId, status) => {
  return Webinar.findByIdAndUpdate(webinarId, { status }, { new: true });
};

const getUpcomingWebinars = async (limit = 5) => {
  return Webinar.find({
    status: "upcoming",
    scheduledAt: { $gte: new Date() },
  })
    .sort({ scheduledAt: 1 })
    .limit(limit)
    .populate("host", "name avatar")
    .select("title coverImage scheduledAt durationMinutes host tags certificateProvided");
};

module.exports = {
  createWebinar,
  getWebinarById,
  getAllWebinars,
  registerForWebinar,
  markAttendance,
  updateWebinarStatus,
  getUpcomingWebinars,
};