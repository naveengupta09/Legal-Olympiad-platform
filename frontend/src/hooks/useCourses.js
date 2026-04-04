import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "@/api/course.api";
import { getListResponse } from "@/utils/apiResponse";

export function useCourses(params = {}) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getAll(params).then(getListResponse),
  });
}

export function useCourse(id) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseApi.getById(id).then((response) => response.data),
    enabled: Boolean(id),
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => courseApi.enroll(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });
}
