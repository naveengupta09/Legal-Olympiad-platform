import http from "./http";

export const collegeApi = {
  getAll: (params) => http.get("/colleges", { params }),
  getById: (id) => http.get(`/colleges/${id}`),
};
