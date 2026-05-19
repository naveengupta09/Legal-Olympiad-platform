const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/quiz.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/", protect, ctrl.getAllQuizzes);
router.post("/", protect, authorize("platform_admin", "college_admin"), ctrl.createQuiz);
router.get("/:id", protect, ctrl.getQuiz);
router.post("/:id/start", protect, ctrl.startAttempt);
router.post("/:id/tab-switch", protect, ctrl.recordTabSwitch);
router.post("/:id/submit", protect, ctrl.submitQuiz);
router.get("/:id/results", protect, authorize("platform_admin", "college_admin"), ctrl.getQuizResults);
router.get("/:id/my-result", protect, ctrl.getMyResult);

module.exports = router;