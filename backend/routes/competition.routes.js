const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/competition.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/",    optionalAuth, ctrl.getAllCompetitions);
router.post("/",   protect, authorize("platform_admin", "college_admin"), ctrl.createCompetition);
router.get("/:id", optionalAuth, ctrl.getCompetitionById);
router.patch("/:id",         protect, ctrl.updateCompetition);
router.post("/:id/register", protect, ctrl.registerForCompetition);
router.patch("/:id/status",  protect, ctrl.updateStatus);
router.post("/:id/results",  protect, ctrl.submitResults);

module.exports = router;