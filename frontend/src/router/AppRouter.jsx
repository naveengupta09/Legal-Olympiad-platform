import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuthStore } from "@/store/authStore";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import CompetitionsPage from "@/pages/competitions/CompetitionsPage";
import CompetitionDetailPage from "@/pages/competitions/CompetitionDetailPage";
import RankingsPage from "@/pages/rankings/RankingsPage";
import WebinarsPage from "@/pages/webinars/WebinarsPage";
import WebinarDetailPage from "@/pages/webinars/WebinarDetailPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import PodcastsPage from "@/pages/podcasts/PodcastsPage";
import CollegesPage from "@/pages/colleges/CollegesPage";
import BlogsPage from "@/pages/content/BlogsPage";
import BlogDetailPage from "@/pages/content/BlogDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

function PrivateRoute({ children }) {
  const { user, isHydrated } = useAuthStore();
  if (!isHydrated) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="competitions" element={<CompetitionsPage />} />
        <Route path="competitions/:id" element={<CompetitionDetailPage />} />
        <Route path="rankings" element={<RankingsPage />} />
        <Route path="webinars" element={<WebinarsPage />} />
        <Route path="webinars/:id" element={<WebinarDetailPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="podcasts" element={<PodcastsPage />} />
        <Route path="colleges" element={<CollegesPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetailPage />} />
        <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}