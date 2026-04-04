import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useContentList(params = {}) {
  return useQuery({
    queryKey: ["content", params],
    queryFn: () => http.get("/content", { params }).then(getListResponse),
  });
}

export function useContentBySlug(slug) {
  return useQuery({
    queryKey: ["content", slug],
    queryFn: () => http.get(`/content/${slug}`).then((response) => response.data),
    enabled: Boolean(slug),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => http.post(`/content/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["content"] }),
  });
}
