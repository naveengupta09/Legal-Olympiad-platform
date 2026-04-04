const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/content.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { imageUpload } = require("../middleware/upload.middleware");

router.get("/",           optionalAuth, ctrl.getAllContent);
router.post("/",          protect, authorize("platform_admin", "college_admin"), ctrl.createContent);
router.get("/slug/:slug", optionalAuth, ctrl.getContentBySlug);
router.get("/:id",        optionalAuth, ctrl.getContentById);
router.patch("/:id",      protect, ctrl.updateContent);
router.delete("/:id",     protect, ctrl.deleteContent);
router.post("/:id/like",  protect, ctrl.toggleLike);
router.patch("/:id/cover",protect, imageUpload.single("cover"), ctrl.uploadCoverImage);

module.exports = router;