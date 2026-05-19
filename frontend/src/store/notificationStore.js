import { create } from "zustand";
import { notificationApi } from "@/api/notification.api";

export const useNotificationStore = create((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      set({ unreadCount: res.data.data?.count ?? res.data.data ?? 0 });
    } catch {
      set({ unreadCount: 0 });
    }
  },
}));
