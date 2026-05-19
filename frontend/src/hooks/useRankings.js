import { useQuery } from "@tanstack/react-query";
import { rankingApi } from "@/api/ranking.api";
import { QUERY_KEYS } from "@/config/constants";

export const useStudentLeaderboard = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.RANKINGS, "students", params],
    queryFn: () => rankingApi.getStudents(params).then((r) => r.data.data),
  });

export const useCollegeLeaderboard = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.RANKINGS, "colleges", params],
    queryFn: () => rankingApi.getColleges(params).then((r) => r.data.data),
  });

export const useMyRanking = (period = "all_time") =>
  useQuery({
    queryKey: [...QUERY_KEYS.RANKINGS, "me", period],
    queryFn: () => rankingApi.getMyRanking(period).then((r) => r.data.data),
  });
