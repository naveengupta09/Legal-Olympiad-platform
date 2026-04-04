import { create } from "zustand";

export const useNotificationStore = create(() => ({
  unreadCount: 0,
  fetchUnreadCount: async () => {},
}));
