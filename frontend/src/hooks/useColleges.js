import { useQuery } from "@tanstack/react-query";
import { collegeApi } from "@/api/college.api";
import { QUERY_KEYS } from "@/config/constants";

export const useColleges = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, params],
    queryFn: () => collegeApi.getAll(params).then((r) => r.data.data),
  });
