import http from "./http";

export const authApi = {
  register: (data) => http.post("/auth/register", data),
  login: (data) => http.post("/auth/login", data),
  logout: () => http.post("/auth/logout"),
  getMe: () => http.get("/auth/me"),
  forgotPassword: (email) => http.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    http.post(`/auth/reset-password?token=${token}`, { password }),
};
