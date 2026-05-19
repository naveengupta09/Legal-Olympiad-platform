import { create } from "zustand";

export const useUiStore = create((set, get) => ({
  theme: localStorage.getItem("theme") || "light",

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    set({ theme: next });
  },
}));
