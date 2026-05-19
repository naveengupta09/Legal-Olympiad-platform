import http from "./http";

export const competitionApi = {
  getAll: (params) => http.get("/competitions", { params }),
  getById: (id) => http.get(`/competitions/${id}`),
  register: (id) => http.post(`/competitions/${id}/register`),
};
