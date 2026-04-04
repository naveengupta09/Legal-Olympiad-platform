import { create } from "zustand";

const STORAGE_KEY = "legal-olympiad.theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(STORAGE_KEY) || (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light");
};

export const useUiStore = create((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    set({ theme: next });
  },
}));
