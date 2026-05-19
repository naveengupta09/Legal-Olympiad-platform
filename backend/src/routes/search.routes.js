const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/search.controller");

// Public — no auth needed
router.get("/", ctrl.globalSearch);
router.get("/autocomplete", ctrl.autocomplete);

module.exports = router;