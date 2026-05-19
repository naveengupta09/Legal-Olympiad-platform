const Quiz = require("../models/Quiz.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");

// ── Create quiz ───────────────────────────────────────────────────────────────
const createQuiz = async (data, userId) => {
  return Quiz.create({ ...data, createdBy: userId });
};

// ── Get quiz list ─────────────────────────────────────────────────────────────
const getAllQuizzes = async (params) => {
  const { page, limit, competition, course } = params;
  const query = { isPublished: true };
  if (competition) query.competition = competition;
  if (course) query.course = course;
  return paginate(Quiz, query, {
    page, limit,
    sort: { createdAt: -1 },
    select: "title description durationMinutes totalMarks passingPercentage startsAt endsAt attemptCount",
  });
};

// ── Get quiz for student (no correct answers) ─────────────────────────────────
const getQuizForStudent = async (quizId, userId) => {
  const quiz = await Quiz.findById(quizId)
    .select("-attempts -questions.options.isCorrect -questions.explanation");

  if (!quiz) throw new ApiError(404, "Quiz not found");
  if (!quiz.isPublished) throw new ApiError(403, "Quiz is not available yet");

  const now = new Date();
  if (quiz.startsAt && now < quiz.startsAt) throw new ApiError(400, "Quiz has not started yet");
  if (quiz.endsAt && now > quiz.endsAt) throw new ApiError(400, "Quiz has ended");

  // Check attempts
  const fullQuiz = await Quiz.findById(quizId).select("attempts maxAttempts");
  const userAttempts = fullQuiz.attempts.filter(
    (a) => a.user.toString() === userId.toString() && a.isSubmitted
  );
  if (userAttempts.length >= quiz.maxAttempts) {
    throw new ApiError(400, `Maximum ${quiz.maxAttempts} attempt(s) allowed`);
  }

  // Shuffle questions if enabled
  let questions = [...quiz.questions];
  if (quiz.shuffleQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }
  if (quiz.shuffleOptions) {
    questions = questions.map((q) => ({
      ...q.toObject(),
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  }

  return { ...quiz.toObject(), questions };
};

// ── Start attempt (record start time) ────────────────────────────────────────
const startAttempt = async (quizId, userId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  // Check for existing in-progress attempt
  const inProgress = quiz.attempts.find(
    (a) => a.user.toString() === userId.toString() && !a.isSubmitted
  );
  if (inProgress) return inProgress; // Resume existing attempt

  quiz.attempts.push({ user: userId, startedAt: new Date() });
  await quiz.save({ validateBeforeSave: false });

  return quiz.attempts[quiz.attempts.length - 1];
};

// ── Record tab switch (anti-cheat) ────────────────────────────────────────────
const recordTabSwitch = async (quizId, userId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const attempt = quiz.attempts.find(
    (a) => a.user.toString() === userId.toString() && !a.isSubmitted
  );
  if (!attempt) throw new ApiError(404, "No active attempt found");

  attempt.tabSwitches += 1;
  attempt.warningCount += 1;

  // Auto-disqualify if exceeds max tab switches
  if (quiz.enableAntiCheat && attempt.tabSwitches >= quiz.maxTabSwitches) {
    attempt.isDisqualified = true;
    attempt.isSubmitted = true;
    attempt.submittedAt = new Date();
    await quiz.save({ validateBeforeSave: false });
    return { disqualified: true, tabSwitches: attempt.tabSwitches };
  }

  await quiz.save({ validateBeforeSave: false });
  return {
    disqualified: false,
    tabSwitches: attempt.tabSwitches,
    warningsLeft: quiz.maxTabSwitches - attempt.tabSwitches,
  };
};

// ── Submit quiz ───────────────────────────────────────────────────────────────
const submitQuiz = async (quizId, userId, answers) => {
  // Fetch quiz WITH correct answers for grading
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const attempt = quiz.attempts.find(
    (a) => a.user.toString() === userId.toString() && !a.isSubmitted
  );
  if (!attempt) throw new ApiError(404, "No active attempt found");
  if (attempt.isDisqualified) throw new ApiError(403, "Attempt has been disqualified");

  // Check time limit
  const elapsed = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);
  const maxSeconds = quiz.durationMinutes * 60;
  if (elapsed > maxSeconds + 30) { // 30-second grace period
    attempt.isDisqualified = true;
    attempt.isSubmitted = true;
    attempt.submittedAt = new Date();
    await quiz.save({ validateBeforeSave: false });
    throw new ApiError(400, "Time limit exceeded");
  }

  // Grade answers
  let totalScore = 0;
  const gradedAnswers = answers.map(({ questionId, selectedOption, shortAnswer, timeSpent }) => {
    const question = quiz.questions.find((q) => q._id.toString() === questionId);
    if (!question) return null;

    let isCorrect = false;
    let marksAwarded = 0;

    if (question.type === "mcq" || question.type === "true_false") {
      const correctOption = question.options.find((o) => o.isCorrect);
      isCorrect = correctOption?._id.toString() === selectedOption;
      if (isCorrect) {
        marksAwarded = question.marks;
      } else if (selectedOption) {
        marksAwarded = -(question.negativeMarks || 0);
      }
    } else if (question.type === "short_answer") {
      // Short answers need manual review — mark as pending
      isCorrect = false;
      marksAwarded = 0;
    }

    totalScore += marksAwarded;
    return { questionId, selectedOption, shortAnswer, isCorrect, marksAwarded, timeSpent };
  }).filter(Boolean);

  totalScore = Math.max(0, totalScore); // no negative total
  const percentage = quiz.totalMarks > 0
    ? Math.round((totalScore / quiz.totalMarks) * 100) : 0;

  // Update attempt
  attempt.answers = gradedAnswers;
  attempt.score = totalScore;
  attempt.totalMarks = quiz.totalMarks;
  attempt.percentage = percentage;
  attempt.timeTaken = elapsed;
  attempt.isSubmitted = true;
  attempt.submittedAt = new Date();

  await quiz.save({ validateBeforeSave: false });

  // Compute rank among all submitted attempts
  const submitted = quiz.attempts.filter((a) => a.isSubmitted && !a.isDisqualified);
  submitted.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
  submitted.forEach((a, i) => { a.rank = i + 1; });
  await quiz.save({ validateBeforeSave: false });

  // Build result response
  let result = {
    score: totalScore,
    totalMarks: quiz.totalMarks,
    percentage,
    rank: attempt.rank,
    timeTaken: elapsed,
    passed: percentage >= quiz.passingPercentage,
  };

  // Include detailed results if allowed
  if (quiz.showResultAfter) {
    result.answers = gradedAnswers;
    if (quiz.allowReview) {
      result.questions = quiz.questions; // includes explanations
    }
  }

  return result;
};

// ── Get quiz results (admin) ──────────────────────────────────────────────────
const getQuizResults = async (quizId) => {
  const quiz = await Quiz.findById(quizId)
    .populate("attempts.user", "name email avatar college");
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const submitted = quiz.attempts
    .filter((a) => a.isSubmitted)
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));

  return {
    quiz: { title: quiz.title, totalMarks: quiz.totalMarks, attemptCount: quiz.attemptCount, averageScore: quiz.averageScore },
    results: submitted,
  };
};

// ── Get my result ─────────────────────────────────────────────────────────────
const getMyResult = async (quizId, userId) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const attempt = quiz.attempts.find(
    (a) => a.user.toString() === userId.toString() && a.isSubmitted
  );
  if (!attempt) throw new ApiError(404, "No submitted attempt found");

  return {
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    rank: attempt.rank,
    timeTaken: attempt.timeTaken,
    passed: attempt.percentage >= quiz.passingPercentage,
    tabSwitches: attempt.tabSwitches,
    isDisqualified: attempt.isDisqualified,
  };
};

module.exports = {
  createQuiz, getAllQuizzes, getQuizForStudent,
  startAttempt, recordTabSwitch, submitQuiz,
  getQuizResults, getMyResult,
};