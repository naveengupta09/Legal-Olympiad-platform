const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/",              protect, ctrl.getMyNotifications);
router.get("/unread-count",  protect, ctrl.getUnreadCount);
router.patch("/read-all",    protect, ctrl.markAllAsRead);
router.patch("/:id/read",    protect, ctrl.markAsRead);
router.delete("/:id",        protect, ctrl.deleteNotification);
router.post("/broadcast",    protect, authorize("platform_admin"), ctrl.broadcast);

module.exports = router;