const Course = require("../models/Course.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const notificationService = require("./notification.service");

const createCourse = async (data, instructorId) => {
  return Course.create({ ...data, instructor: instructorId });
};

const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId)
    .populate("instructor", "name avatar bio");
  if (!course) throw new ApiError(404, "Course not found");
  return course;
};

const getAllCourses = async (queryParams) => {
  const { page, limit, category, level, free, featured, search } = queryParams;

  const query = { isPublished: true };
  if (category) query.category = category;
  if (level) query.level = level;
  if (free === "true") query.isFree = true;
  if (featured === "true") query.isFeatured = true;
  if (search) query.title = { $regex: search, $options: "i" };

  return paginate(Course, query, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: "instructor", select: "name avatar" }],
    select: "title slug shortDescription coverImage instructor category level price isFree totalDuration totalLessons rating reviewCount isFeatured",
  });
};

const enrollInCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  if (!course.isPublished) throw new ApiError(400, "Course is not available");

  const alreadyEnrolled = course.enrollments.some(
    (e) => e.user.toString() === userId.toString()
  );
  if (alreadyEnrolled) throw new ApiError(409, "Already enrolled in this course");

  course.enrollments.push({ user: userId });
  await course.save();

  const User = require("../models/User.model");
  await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

  await notificationService.create({
    recipient: userId,
    title: "Course Enrollment Confirmed",
    message: `You are now enrolled in "${course.title}"`,
    type: "course",
    relatedEntity: course._id,
    relatedModel: "Course",
  });

  return course;
};

const updateProgress = async (courseId, userId, lessonId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const enrollment = course.enrollments.find(
    (e) => e.user.toString() === userId.toString()
  );
  if (!enrollment) throw new ApiError(404, "Not enrolled in this course");

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  enrollment.progress = totalLessons
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  if (enrollment.progress === 100 && !enrollment.isCompleted) {
    enrollment.isCompleted = true;
    enrollment.completedAt = new Date();
    await notificationService.create({
      recipient: userId,
      title: "Course Completed!",
      message: `Congratulations! You have completed "${course.title}"`,
      type: "course",
      relatedEntity: course._id,
      relatedModel: "Course",
    });
  }

  await course.save();
  return enrollment;
};

module.exports = {
  createCourse,
  getCourseById,
  getAllCourses,
  enrollInCourse,
  updateProgress,
};