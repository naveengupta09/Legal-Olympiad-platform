import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useWebinars(params = {}) {
  return useQuery({
    queryKey: ["webinars", params],
    queryFn: () => http.get("/webinars", { params }).then(getListResponse),
  });
}

export function useWebinar(id) {
  return useQuery({
    queryKey: ["webinars", id],
    queryFn: () => http.get(`/webinars/${id}`).then((response) => response.data),
    enabled: Boolean(id),
  });
}

export function useRegisterWebinar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => http.post(`/webinars/${id}/register`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["webinars"] }),
  });
}
