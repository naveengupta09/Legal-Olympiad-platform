import http from "./http";

export const rankingApi = {
  getStudents: (params) => http.get("/rankings/students", { params }),
  getColleges: (params) => http.get("/rankings/colleges", { params }),
  getMyRanking: (period = "all_time") =>
    http.get("/rankings/me", { params: { period } }),
};
