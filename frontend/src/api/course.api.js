import http from "./http";

export const courseApi = {
  getAll: (params) => http.get("/courses", { params }),
  getById: (id) => http.get(`/courses/${id}`),
  enroll: (id) => http.post(`/courses/${id}/enroll`),
  updateProgress: (id, lessonId) =>
    http.patch(`/courses/${id}/progress`, { lessonId }),
};
