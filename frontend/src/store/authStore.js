import { create } from "zustand";
import { authApi } from "@/api/auth.api";
import { authTokenStorageKey } from "@/api/http";

const STORAGE_KEY = "legal-olympiad.auth.user";

const readStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const readStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(authTokenStorageKey);
};

const writeStoredToken = (token) => {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(authTokenStorageKey);
    return;
  }
  window.localStorage.setItem(authTokenStorageKey, token);
};

const pickUser = (payload) => payload?.user || payload?.data?.user || payload?.data || payload || null;

const pickToken = (payload) => payload?.accessToken || payload?.data?.accessToken || payload?.token || null;

export const useAuthStore = create((set, get) => ({
  user: readStoredUser(),
  accessToken: readStoredToken(),
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    if (!readStoredToken()) {
      set({ isLoading: false, isHydrated: true });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authApi.me();
      const user = pickUser(response.data);
      if (user) {
        writeStoredUser(user);
        set({ user });
      }
    } catch {
      set({ user: readStoredUser() });
    } finally {
      set({ isLoading: false, isHydrated: true });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(credentials);
      const user = pickUser(response.data);
      const accessToken = pickToken(response.data);
      if (user) writeStoredUser(user);
      writeStoredToken(accessToken);
      set({ user, accessToken, isLoading: false, isHydrated: true });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false, isHydrated: true });
      return { success: false, message: error?.response?.data?.message || "Login failed" };
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(payload);
      const user = pickUser(response.data);
      const accessToken = pickToken(response.data);
      if (user) writeStoredUser(user);
      writeStoredToken(accessToken);
      set({ user, accessToken, isLoading: false, isHydrated: true });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false, isHydrated: true });
      return { success: false, message: error?.response?.data?.message || "Registration failed" };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors while clearing local state
    }
    writeStoredUser(null);
    writeStoredToken(null);
    set({ user: null, accessToken: null, isHydrated: true });
  },

  updateUser: (updates) => {
    const nextUser = { ...(get().user || {}), ...(updates || {}) };
    writeStoredUser(nextUser);
    set({ user: nextUser });
  },

  isLoggedIn: () => Boolean(get().user),
}));
