const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/college.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { imageUpload } = require("../middleware/upload.middleware");

router.get("/",    ctrl.getAllColleges);
router.post("/",   protect, ctrl.createCollege);
router.get("/:id", ctrl.getCollegeById);
router.patch("/:id",           protect, ctrl.updateCollege);
router.patch("/:id/logo",      protect, imageUpload.single("logo"), ctrl.updateCollegeLogo);
router.post("/:id/students",   protect, authorize("college_admin", "platform_admin"), ctrl.addStudent);
router.patch("/:id/verify",    protect, authorize("platform_admin"), ctrl.verifyCollege);

module.exports = router;