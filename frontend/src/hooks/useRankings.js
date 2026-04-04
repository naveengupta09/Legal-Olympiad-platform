import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useStudentLeaderboard(params = {}) {
  return useQuery({
    queryKey: ["rankings", "students", params],
    queryFn: () => http.get("/rankings/students", { params }).then(getListResponse),
  });
}

export function useCollegeLeaderboard(params = {}) {
  return useQuery({
    queryKey: ["rankings", "colleges", params],
    queryFn: () => http.get("/rankings/colleges", { params }).then(getListResponse),
  });
}

export function useMyRanking(period = "all_time") {
  return useQuery({
    queryKey: ["rankings", "me", period],
    queryFn: async () => {
      try {
        const response = await http.get("/rankings/me", { params: { period } });
        return response.data;
      } catch (error) {
        if (error?.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
    retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 3,
  });
}
