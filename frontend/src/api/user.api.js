import { http } from "./http";

export const userApi = {
  updateProfile: (payload) => http.patch("/users/profile", payload),
  updateAvatar: (formData) => http.patch("/users/avatar", formData),
};
