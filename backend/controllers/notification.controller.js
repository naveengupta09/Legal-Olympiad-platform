const notificationService = require("../services/notification.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id, req.query);
  res.json(new ApiResponse(200, result, "Notifications fetched"));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  res.json(new ApiResponse(200, notification, "Marked as read"));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const count = await notificationService.markAllAsRead(req.user._id);
  res.json(new ApiResponse(200, { count }, "All marked as read"));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  res.json(new ApiResponse(200, { count }, "Unread count fetched"));
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  res.json(new ApiResponse(200, null, "Notification deleted"));
});

const broadcast = asyncHandler(async (req, res) => {
  const count = await notificationService.broadcastToAll(req.body);
  res.json(new ApiResponse(200, { count }, `Broadcast sent to ${count} users`));
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification, broadcast };