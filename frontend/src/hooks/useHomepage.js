import { useQuery } from "@tanstack/react-query";
import { homepageApi } from "@/api/homepage.api";
import { QUERY_KEYS } from "@/config/constants";

export const useHomepageFeed = () =>
  useQuery({
    queryKey: QUERY_KEYS.HOMEPAGE,
    queryFn: () => homepageApi.getFeed().then((r) => r.data.data),
  });
