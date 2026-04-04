import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useCompetitions(params = {}) {
  return useQuery({
    queryKey: ["competitions", params],
    queryFn: () => http.get("/competitions", { params }).then(getListResponse),
  });
}

export function useCompetition(id) {
  return useQuery({
    queryKey: ["competitions", id],
    queryFn: () => http.get(`/competitions/${id}`).then((response) => response.data),
    enabled: Boolean(id),
  });
}

export function useRegisterCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => http.post(`/competitions/${id}/register`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["competitions"] }),
  });
}
