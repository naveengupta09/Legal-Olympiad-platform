const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/homepage.controller");

router.get("/feed",  ctrl.getHomepageFeed);
router.get("/stats", ctrl.getPlatformStats);

module.exports = router;