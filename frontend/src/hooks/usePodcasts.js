import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function usePodcasts(params = {}) {
  return useQuery({
    queryKey: ["podcasts", params],
    queryFn: () => http.get("/podcasts", { params }).then(getListResponse),
  });
}
