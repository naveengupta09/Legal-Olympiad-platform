import http from "./http";

export const podcastApi = {
  getAll: (params) => http.get("/podcasts", { params }),
  getById: (id) => http.get(`/podcasts/${id}`),
  toggleLike: (id) => http.post(`/podcasts/${id}/like`),
};
