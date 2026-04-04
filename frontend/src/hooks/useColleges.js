import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getListResponse } from "@/utils/apiResponse";

export function useColleges(params = {}) {
  return useQuery({
    queryKey: ["colleges", params],
    queryFn: () => http.get("/colleges", { params }).then(getListResponse),
  });
}
