import { create } from "zustand";
import { authApi } from "@/api/auth.api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isHydrated: false,

  isLoggedIn: () => !!get().user,

  hydrate: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isHydrated: true });
      return;
    }
    try {
      const res = await authApi.getMe();
      set({ user: res.data.data, isHydrated: true });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, isHydrated: true });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const { user, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || "Login failed" };
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register(data);
      const { user, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || "Registration failed" };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("accessToken");
    set({ user: null });
  },

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));
