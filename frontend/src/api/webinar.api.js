import http from "./http";

export const webinarApi = {
  getAll: (params) => http.get("/webinars", { params }),
  getById: (id) => http.get(`/webinars/${id}`),
  register: (id) => http.post(`/webinars/${id}/register`),
};
