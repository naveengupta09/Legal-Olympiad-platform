import http from "./http";

export const contentApi = {
  getAll: (params) => http.get("/content", { params }),
  getBySlug: (slug) => http.get(`/content/slug/${slug}`),
  toggleLike: (id) => http.post(`/content/${id}/like`),
};
