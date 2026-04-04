const Notification = require("../models/Notification.model");
const paginate = require("../utils/paginate");
const ApiError = require("../utils/ApiError");

const create = async ({ recipient, title, message, type, relatedEntity, relatedModel, actionUrl }) => {
  return Notification.create({ recipient, title, message, type, relatedEntity, relatedModel, actionUrl });
};

const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const query = { recipient: userId };
  if (unreadOnly === "true" || unreadOnly === true) query.isRead = false;

  return paginate(Notification, query, {
    page,
    limit,
    sort: { createdAt: -1 },
  });
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
};

const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return result.modifiedCount;
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });
  if (!notification) throw new ApiError(404, "Notification not found");
};

const broadcastToAll = async ({ title, message, type, actionUrl }) => {
  const User = require("../models/User.model");
  const users = await User.find({ isActive: true }).select("_id");
  const docs = users.map((u) => ({ recipient: u._id, title, message, type, actionUrl }));
  await Notification.insertMany(docs);
  return docs.length;
};

module.exports = {
  create,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  broadcastToAll,
};