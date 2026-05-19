const express = require("express");
const router = express.Router();
const { globalLimiter } = require("../middleware/rateLimit.middleware");

router.use(globalLimiter);

router.use("/auth",         require("./auth.routes"));
router.use("/users",        require("./user.routes"));
router.use("/colleges",     require("./college.routes"));
router.use("/content",      require("./content.routes"));
router.use("/competitions", require("./competition.routes"));
router.use("/rankings",     require("./ranking.routes"));
router.use("/webinars",     require("./webinar.routes"));
router.use("/courses",      require("./course.routes"));
router.use("/podcasts",     require("./podcast.routes"));
router.use("/notifications",require("./notification.routes"));
router.use("/homepage",     require("./homepage.routes"));
router.use("/search",       require("./search.routes"));
router.use("/quizzes",      require("./quiz.routes"));

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Legal Olympiad API is running", timestamp: new Date() });
});

module.exports = router;