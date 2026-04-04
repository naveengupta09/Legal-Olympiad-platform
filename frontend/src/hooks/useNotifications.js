import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => http.get("/notifications", { params }).then(getListResponse),
  });
}
