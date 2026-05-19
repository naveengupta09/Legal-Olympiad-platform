import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?session=expired";
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject({ ...error, message, errors: error.response?.data?.errors || [] });
  },
);

export default http;
