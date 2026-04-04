import { useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";
import { useUiStore } from "./store/uiStore";
import { useNotificationStore } from "./store/notificationStore";
import ScrollToTop from "./components/shared/ScrollToTop";
import PageLoader from "./components/shared/PageLoader";
import ErrorBoundary from "./components/shared/ErrorBoundary";

export default function App() {
  const { hydrate, user }            = useAuthStore();
  const { theme }                    = useUiStore();
  const { fetchUnreadCount }         = useNotificationStore();

  /* ── Hydrate auth on mount ── */
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  /* ── Sync dark-mode class on <html> ── */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  /* ── Poll unread notification count when logged in ── */
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}