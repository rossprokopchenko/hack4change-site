import { useQuery } from "@tanstack/react-query";
import { useGetSupabaseTeamsService, TeamsRequest, TeamsResponse } from "@/services/supabase/teams-admin";

export const teamsQueryKeys = {
  list: () => ["teams", "list"] as const,
  details: (id: string) => ["teams", "details", id] as const,
};

export const useGetTeamsQuery = (params: TeamsRequest) => {
  const getTeams = useGetSupabaseTeamsService();
  
  return useQuery({
    queryKey: [...teamsQueryKeys.list(), params],
    queryFn: async () => {
      const response = await getTeams(params);
      if (response.status !== 200) {
        throw new Error("Failed to fetch teams");
      }
      return response.data;
    },
  });
};
