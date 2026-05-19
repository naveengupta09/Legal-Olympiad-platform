import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { competitionApi } from "@/api/competition.api";
import { QUERY_KEYS } from "@/config/constants";
import toast from "react-hot-toast";

export const useCompetitions = (params = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COMPETITIONS, params],
    queryFn: () => competitionApi.getAll(params).then((r) => r.data.data),
  });

export const useCompetition = (id) =>
  useQuery({
    queryKey: [...QUERY_KEYS.COMPETITIONS, id],
    queryFn: () => competitionApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useRegisterCompetition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => competitionApi.register(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.COMPETITIONS });
      toast.success("Registered successfully!");
    },
    onError: (err) => toast.error(err.message || "Registration failed"),
  });
};
