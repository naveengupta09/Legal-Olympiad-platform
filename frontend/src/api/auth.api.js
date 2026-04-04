import { http } from "./http";

export const authApi = {
  login: (payload) => http.post("/auth/login", payload),
  register: (payload) => http.post("/auth/register", payload),
  logout: () => http.post("/auth/logout"),
  me: () => http.get("/auth/me"),
  forgotPassword: (email) => http.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => http.post(`/auth/reset-password?token=${encodeURIComponent(token)}`, { password }),
  verifyEmail: (token) => http.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),
};
