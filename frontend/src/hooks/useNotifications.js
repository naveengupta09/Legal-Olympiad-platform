import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification.api";
import { QUERY_KEYS } from "@/config/constants";

export const useNotifications = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationApi.getAll(params).then((r) => r.data.data),
  });
