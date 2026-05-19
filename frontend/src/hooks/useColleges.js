import { useQuery } from "@tanstack/react-query";
import { collegeApi } from "@/api/college.api";
import { QUERY_KEYS } from "@/config/constants";

export const useColleges = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, params],
    queryFn: () => collegeApi.getAll(params).then((r) => r.data.data),
  });

export const useCollege = (id) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id],
    queryFn: () => collegeApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
