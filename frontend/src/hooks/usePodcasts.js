import { useQuery } from "@tanstack/react-query";
import { podcastApi } from "@/api/podcast.api";
import { QUERY_KEYS } from "@/config/constants";

export const usePodcasts = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PODCASTS, params],
    queryFn: () => podcastApi.getAll(params).then((r) => r.data.data),
  });

export const usePodcast = (id) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PODCASTS, id],
    queryFn: () => podcastApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
