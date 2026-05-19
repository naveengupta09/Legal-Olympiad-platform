import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import AppRouter from "./router/AppRouter";
import ScrollToTop from "./component/layout/shared/ScrollToTop";
import { useAuthStore } from "./store/authStore";
import { useNotificationStore } from "./store/notificationStore";
import { useUiStore } from "./store/uiStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);
  const theme = useUiStore((s) => s.theme);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user, fetchUnreadCount]);

  return (
    <>
      <ScrollToTop />
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
