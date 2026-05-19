import http from "./http";

export const homepageApi = {
  getFeed: () => http.get("/homepage/feed"),
  getStats: () => http.get("/homepage/stats"),
};
