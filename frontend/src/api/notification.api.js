import http from "./http";

export const notificationApi = {
  getAll: (params) => http.get("/notifications", { params }),
  getUnreadCount: () => http.get("/notifications/unread-count"),
  markAsRead: (id) => http.patch(`/notifications/${id}/read`),
  markAllAsRead: () => http.patch("/notifications/read-all"),
};
