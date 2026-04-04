const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/podcast.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { audioUpload, imageUpload } = require("../middleware/upload.middleware");

router.get("/",          optionalAuth, ctrl.getAllPodcasts);
router.get("/featured",  ctrl.getFeaturedPodcasts);
router.post("/",         protect, authorize("platform_admin"), ctrl.createPodcast);
router.get("/:id",       optionalAuth, ctrl.getPodcastById);
router.post("/:id/like", protect, ctrl.toggleLike);
router.patch("/:id/audio", protect, authorize("platform_admin"), audioUpload.single("audio"), ctrl.uploadAudio);

module.exports = router;