import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { getPayload } from "@/utils/apiResponse";

export function useHomepageFeed() {
  return useQuery({
    queryKey: ["homepage", "feed"],
    queryFn: () => http.get("/homepage/feed").then(getPayload),
  });
}
