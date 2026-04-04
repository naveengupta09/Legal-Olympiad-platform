const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ranking.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/students",          ctrl.getStudentLeaderboard);
router.get("/colleges",          ctrl.getCollegeLeaderboard);
router.get("/top-students",      ctrl.getTopStudents);
router.get("/top-colleges",      ctrl.getTopColleges);
router.get("/me",                protect, ctrl.getMyRanking);
router.get("/user/:userId",      ctrl.getUserRanking);
router.post("/recompute",        protect, authorize("platform_admin"), ctrl.triggerRecompute);

module.exports = router;