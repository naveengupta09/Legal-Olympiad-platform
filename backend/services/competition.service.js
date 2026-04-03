const Competition = require("../models/Competition.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const notificationService = require("./notification.service");

const createCompetition = async (data, organizerId) => {
  const competition = await Competition.create({ ...data, organizer: organizerId });
  return competition;
};

const getCompetitionById = async (competitionId) => {
  const competition = await Competition.findById(competitionId)
    .populate("organizer", "name avatar")
    .populate("registrations.user", "name avatar college")
    .populate("registrations.college", "name logo");

  if (!competition) throw new ApiError(404, "Competition not found");
  return competition;
};

const getAllCompetitions = async (queryParams) => {
  const { page, limit, status, type, featured, search } = queryParams;

  const query = { isPublished: true };
  if (status) query.status = status;
  if (type) query.type = type;
  if (featured === "true") query.isFeatured = true;
  if (search) query.title = { $regex: search, $options: "i" };

  return paginate(Competition, query, {
    page,
    limit,
    sort: { startDate: 1 },
    populate: [{ path: "organizer", select: "name avatar" }],
    select: "title slug type status coverImage startDate endDate registrationDeadline entryFee prizePool isFeatured",
  });
};

const registerForCompetition = async (competitionId, userId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) throw new ApiError(404, "Competition not found");

  if (competition.status !== "registration_open") {
    throw new ApiError(400, "Registration is not open for this competition");
  }

  if (new Date() > competition.registrationDeadline) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  const alreadyRegistered = competition.registrations.some(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyRegistered) throw new ApiError(409, "Already registered");

  if (competition.maxParticipants &&
      competition.registrations.length >= competition.maxParticipants) {
    throw new ApiError(400, "Competition is full");
  }

  const user = await User.findById(userId).select("college");

  competition.registrations.push({
    user: userId,
    college: user.college || null,
  });
  await competition.save();

  await User.findByIdAndUpdate(userId, {
    $addToSet: { registeredCompetitions: competitionId },
  });

  await notificationService.create({
    recipient: userId,
    title: "Registration Confirmed",
    message: `You have successfully registered for "${competition.title}"`,
    type: "competition",
    relatedEntity: competition._id,
    relatedModel: "Competition",
    actionUrl: `/competitions/${competition._id}`,
  });

  return competition;
};

const updateCompetitionStatus = async (competitionId, status, requesterId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) throw new ApiError(404, "Competition not found");

  const isOrganizer = competition.organizer.toString() === requesterId.toString();
  if (!isOrganizer) throw new ApiError(403, "Not authorized");

  competition.status = status;
  await competition.save();
  return competition;
};

const submitResults = async (competitionId, results, requesterId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) throw new ApiError(404, "Competition not found");

  const isOrganizer = competition.organizer.toString() === requesterId.toString();
  if (!isOrganizer) throw new ApiError(403, "Not authorized");

  for (const result of results) {
    const reg = competition.registrations.find(
      (r) => r.user.toString() === result.userId
    );
    if (reg) {
      reg.totalScore = result.score;
      reg.rank = result.rank;
      reg.isQualified = result.isQualified || false;
    }
  }

  competition.status = "completed";
  await competition.save();

  for (const result of results) {
    await notificationService.create({
      recipient: result.userId,
      title: "Results Published",
      message: `Results for "${competition.title}" are now available. Your rank: #${result.rank}`,
      type: "competition",
      relatedEntity: competition._id,
      relatedModel: "Competition",
    });
  }

  return competition;
};

const updateCompetition = async (competitionId, updateData, requesterId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) throw new ApiError(404, "Competition not found");

  const isOrganizer = competition.organizer.toString() === requesterId.toString();
  if (!isOrganizer) throw new ApiError(403, "Not authorized");

  return Competition.findByIdAndUpdate(competitionId, updateData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  createCompetition,
  getCompetitionById,
  getAllCompetitions,
  registerForCompetition,
  updateCompetitionStatus,
  submitResults,
  updateCompetition,
};