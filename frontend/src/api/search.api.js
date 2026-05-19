import api from "./axiosInstance";

export const searchApi = {
  global: (q, params = {}) => api.get("/search", { params: { q, ...params } }),
  autocomplete: (q) => api.get("/search/autocomplete", { params: { q } }),
};