import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/component/layout/RootLayout";
import AuthLayout from "@/component/layout/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { InlineLoader } from "@/components/QueryState";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import CompetitionsPage from "@/pages/competitions/CompetitionsPage";
import CompetitionDetailPage from "@/pages/competitions/CompetitionDetailsPage";
import RankingsPage from "@/pages/competitions/RankingsPage";
import WebinarsPage from "@/pages/competitions/WebinarsPage";
import WebinarDetailPage from "@/pages/competitions/WebinarDetailsPage";
import CoursesPage from "@/pages/competitions/CoursesPage";
import CourseDetailPage from "@/pages/competitions/CoursesDetailsPage";
import PodcastsPage from "@/pages/competitions/PoadcastPage";
import PodcastDetailPage from "@/pages/competitions/PodcastDetailPage";
import CollegesPage from "@/pages/colleges/CollegesPage";
import CollegeDetailPage from "@/pages/colleges/CollegeDetailPage";
import BlogsPage from "@/pages/content/BlogPage";
import BlogDetailPage from "@/pages/content/BlogDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

function PrivateRoute({ children }) {
  const { user, isHydrated } = useAuthStore();
  if (!isHydrated) {
    return (
      <div className="container py-24 flex justify-center">
        <InlineLoader />
      </div>
    );
  }
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
        <Route path="podcasts/:id" element={<PodcastDetailPage />} />
        <Route path="colleges" element={<CollegesPage />} />
        <Route path="colleges/:id" element={<CollegeDetailPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetailPage />} />
        <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="oauth/callback" element={<OAuthCallbackPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
