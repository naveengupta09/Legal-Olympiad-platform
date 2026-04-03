const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/webinar.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/",          optionalAuth, ctrl.getAllWebinars);
router.get("/upcoming",  ctrl.getUpcomingWebinars);
router.post("/",         protect, authorize("platform_admin", "college_admin"), ctrl.createWebinar);
router.get("/:id",       optionalAuth, ctrl.getWebinarById);
router.post("/:id/register",  protect, ctrl.registerForWebinar);
router.patch("/:id/status",   protect, authorize("platform_admin", "college_admin"), ctrl.updateStatus);
router.post("/:id/attendance",protect, authorize("platform_admin", "college_admin"), ctrl.markAttendance);

module.exports = router;