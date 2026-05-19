import { useEffect, Suspense } from "react";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";
import { useUiStore } from "./store/uiStore";
import { useNotificationStore } from "./store/notificationStore";
import { useSocketInit } from "./hooks/useSocket";
import ScrollToTop from "./components/shared/ScrollToTop";
import PageLoader from "./components/shared/PageLoader";
import ErrorBoundary from "./components/shared/ErrorBoundary";

function SocketProvider() {
  useSocketInit(); // connects socket when user is logged in
  return null;
}

export default function App() {
  const { hydrate, user } = useAuthStore();
  const { theme } = useUiStore();
  const { fetchUnreadCount } = useNotificationStore();

  // Hydrate auth on mount
  useEffect(() => { hydrate(); }, [hydrate]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Poll unread count every 60s (fallback when socket is offline)
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(id);
  }, [user, fetchUnreadCount]);

  return (
    <ErrorBoundary>
      <SocketProvider />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}