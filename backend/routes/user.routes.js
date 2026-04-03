const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { imageUpload } = require("../middleware/upload.middleware");

router.get("/",              protect, authorize("platform_admin"), ctrl.getAllStudents);
router.get("/profile",       protect, ctrl.getMyProfile);
router.patch("/profile",     protect, ctrl.updateMyProfile);
router.patch("/avatar",      protect, imageUpload.single("avatar"), ctrl.updateAvatar);
router.get("/:id",           protect, ctrl.getUserById);
router.patch("/:id/deactivate", protect, authorize("platform_admin"), ctrl.deactivateUser);

module.exports = router;