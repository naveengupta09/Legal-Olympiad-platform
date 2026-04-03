import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../api/course.api";
import { QUERY_KEYS } from "../config/constants";
import toast from "react-hot-toast";

export const useCourses = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COURSES, params],
    queryFn: () => courseApi.getAll(params).then(r => r.data),
  });

export const useCourse = (id) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COURSES, id],
    queryFn: () => courseApi.getById(id).then(r => r.data),
    enabled: !!id,
  });

export const useEnrollCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => courseApi.enroll(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COURSES });
      toast.success("Enrolled successfully!");
    },
  });
};

export const useUpdateProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lessonId }) => courseApi.updateProgress(id, lessonId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.COURSES }),
  });
};