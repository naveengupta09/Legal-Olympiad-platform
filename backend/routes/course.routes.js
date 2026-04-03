const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/course.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/",    optionalAuth, ctrl.getAllCourses);
router.post("/",   protect, authorize("platform_admin"), ctrl.createCourse);
router.get("/:id", optionalAuth, ctrl.getCourseById);
router.post("/:id/enroll",   protect, ctrl.enrollInCourse);
router.patch("/:id/progress",protect, ctrl.updateProgress);

module.exports = router;