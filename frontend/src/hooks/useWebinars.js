import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { webinarApi } from "@/api/webinar.api";
import { QUERY_KEYS } from "@/config/constants";
import toast from "react-hot-toast";

export const useWebinars = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.WEBINARS, params],
    queryFn: () => webinarApi.getAll(params).then((r) => r.data.data),
  });

export const useWebinar = (id) =>
  useQuery({
    queryKey: [...QUERY_KEYS.WEBINARS, id],
    queryFn: () => webinarApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useRegisterWebinar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => webinarApi.register(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WEBINARS });
      toast.success("Registered for webinar!");
    },
    onError: (err) => toast.error(err.message || "Registration failed"),
  });
};
