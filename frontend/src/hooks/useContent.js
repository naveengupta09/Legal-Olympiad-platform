import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/api/content.api";
import { QUERY_KEYS } from "@/config/constants";

export const useContentList = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, "list", params],
    queryFn: () => contentApi.getAll(params).then((r) => r.data.data),
  });

export const useContentBySlug = (slug) =>
  useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, slug],
    queryFn: () => contentApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });

export const useToggleLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => contentApi.toggleLike(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT }),
  });
};
