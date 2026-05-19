import http from "./http";

export const userApi = {
  getProfile: () => http.get("/users/profile"),
  updateProfile: (data) => http.patch("/users/profile", data),
  updateAvatar: (formData) =>
    http.patch("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
