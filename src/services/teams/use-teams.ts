import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import useAuth from "@/services/auth/use-auth";

// Explicitly cast to ensure types are picked up correctly
const supabase = supabaseClient as SupabaseClient<Database>;

export interface Team {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "leader" | "member";
  joined_at: string;
}

export interface TeamWithMembers extends Team {
  team_members: (TeamMember & {
    profiles: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      email: string;
    };
  })[];
}

// Get current user's team
export function useUserTeam() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userTeam", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: memberData, error: memberError } = await supabase
        .from("team_members")
        .select("team_id, role")
        .eq("user_id", user.id)
        .single();

      if (memberError || !memberData) return null;

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
            id,
            user_id,
            role,
            joined_at,
            profiles (
              id,
              first_name,
              last_name,
              email
            )
          )
        `)
        .eq("id", memberData.team_id)
        .single();

      if (teamError) throw teamError;

      return {
        ...teamData,
        userRole: memberData.role,
      } as TeamWithMembers & { userRole: "leader" | "member" };
    },
    enabled: !!user?.id,
  });
}

// Search available teams (not full)
export function useSearchTeams(searchQuery: string) {
  return useQuery({
    queryKey: ["searchTeams", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("teams")
        .select(`
          *,
          team_members (count)
        `);

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      // Filter out full teams
      return (data || []).filter((team: any) => {
        const memberCount = team.team_members?.[0]?.count || 0;
        return memberCount < team.max_members;
      });
    },
    enabled: searchQuery.length > 0,
  });
}

// Create team
export function useCreateTeam() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamData: {
      name: string;
      description?: string;
      max_members?: number;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Create team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: teamData.name,
          description: teamData.description || null,
          max_members: 4,
          created_by: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team leader
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "leader",
        });

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
      queryClient.invalidateQueries({ queryKey: ["searchTeams"] });
    },
  });
}

// Join team
export function useJoinTeam() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("team_members").insert({
        team_id: teamId,
        user_id: user.id,
        role: "member",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
      queryClient.invalidateQueries({ queryKey: ["searchTeams"] });
    },
  });
}

// Leave team
export function useLeaveTeam() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
      queryClient.invalidateQueries({ queryKey: ["searchTeams"] });
    },
  });
}
