import { useCallback } from "react";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import { User } from "../api/types/user";
import { Role, RoleEnum } from "../api/types/role";

const supabase = supabaseClient as SupabaseClient<Database>;

export type UsersRequest = {
  page: number;
  limit: number;
  filters?: {
    roles?: Role[];
    rsvpStatuses?: string[];
    search?: {
      field: string;
      value: string;
    };
  };
  sort?: Array<{
    orderBy: keyof User;
    order: "asc" | "desc";
  }>;
};

export type UsersResponse = {
  data: User[];
  hasNextPage: boolean;
};

// Map Supabase profile to User type
function mapProfileToUser(profile: any): User {
  // team_members can be an object (if 1:1 relationship detected by Supabase) or an array
  const teamMembersRaw = profile.team_members;
  const teamMembers = Array.isArray(teamMembersRaw) ? teamMembersRaw : (teamMembersRaw ? [teamMembersRaw] : []);
  
  let teamName: string | undefined = undefined;

  if (teamMembers.length > 0) {
    const rawTeam = teamMembers[0].team;
    const teamData = Array.isArray(rawTeam) ? rawTeam[0] : rawTeam;
    teamName = teamData?.name;
  }

  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  
  // If name is empty (common for Google users), use email part or full email
  const displayFirstName = firstName || (fullName ? "" : profile.email.split('@')[0]);

  return {
    id: profile.id,
    email: profile.email,
    firstName: displayFirstName,
    lastName: lastName,
    photo: profile.avatar_url ? { id: "", path: profile.avatar_url } : undefined,
    role: {
      id: profile.role === 'admin' ? RoleEnum.ADMIN : RoleEnum.USER,
      name: profile.role === 'admin' ? 'Admin' : 'User',
    },
    rsvpStatus: profile.rsvp_status,
    createdAt: profile.created_at,
    teamName: teamName,
  };
}

export function useGetSupabaseUsersService() {
  return useCallback(
    async (data: UsersRequest, requestConfig?: { signal?: AbortSignal }) => {
      try {
        let query = supabase
          .from("profiles")
          .select("*, team_members(team:teams(name))", { count: "exact" });

        // Apply role filters
        if (data.filters?.roles && data.filters.roles.length > 0) {
          const roleValues = data.filters.roles.map(r => 
            Number(r.id) === RoleEnum.ADMIN ? 'admin' : 'user'
          );
          query = query.in("role", roleValues);
        }


        // Apply RSVP status filters
        if (data.filters?.rsvpStatuses && data.filters.rsvpStatuses.length > 0) {
          // Extract id values from objects if they exist
          const statusValues = data.filters.rsvpStatuses.map((status: any) => 
            typeof status === 'string' ? status : status.id
          );
          console.log("Applying RSVP filter:", statusValues);
          query = query.in("rsvp_status", statusValues);
        }

        // Apply search filter
        if (data.filters?.search && data.filters.search.value) {
          const searchValue = `%${data.filters.search.value}%`;
          const fieldMap: Record<string, string> = {
            firstName: "first_name",
            lastName: "last_name",
            email: "email",
            team: "team_members.team.name",
          };
          const dbField = fieldMap[data.filters.search.field] || "email";
          
          // For team search, we need to handle it differently because it's a join
          if (data.filters.search.field === "team") {
            // We'll filter on the client side for team since it's a join
          } else {
            query = query.ilike(dbField, searchValue);
          }
        }

        // Apply sorting
        if (data.sort && data.sort.length > 0) {
          const sortField = data.sort[0].orderBy;
          const sortOrder = data.sort[0].order === "asc";
          
          // Map User fields to Supabase fields
          const fieldMap: Record<string, string> = {
            id: "id",
            email: "email",
            firstName: "first_name",
            lastName: "last_name",
          };
          
          const dbField = fieldMap[sortField as string] || "created_at";
          query = query.order(dbField, { ascending: sortOrder });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        // Apply pagination
        const from = (data.page - 1) * data.limit;
        const to = from + data.limit - 1;
        query = query.range(from, to);

        const { data: profiles, error, count } = await query;

        if (error) {
          return {
            status: 500,
            data: { data: [], hasNextPage: false },
          };
        }

        const users = (profiles || []).map(mapProfileToUser);
        const hasNextPage = count ? from + data.limit < count : false;

        return {
          status: 200,
          data: {
            data: users,
            hasNextPage,
            total: count || 0,
          },
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        return {
          status: 500,
          data: { data: [], hasNextPage: false },
        };
      }
    },
    []
  );
}

export function useGetSupabaseUserService() {
  return useCallback(
    async (userId: string) => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*, team_members(team:teams(name))")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        return { status: 404, data: null };
      }

      return {
        status: 200,
        data: mapProfileToUser(profile),
      };
    },
    []
  );
}

export function useDeleteSupabaseUserService() {
  return useCallback(
    async (userId: string) => {
      // Delete from auth.users will cascade to profiles
      const  { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        return { status: 500, data: undefined };
      }

      return { status: 200, data: undefined };
    },
    []
  );
}

export function usePatchSupabaseUserService() {
  return useCallback(
    async (data: { id: string; data: Partial<User> }) => {
      const { error } = await (supabase
        .from("profiles") as any)
        .update({
          first_name: data.data.firstName,
          last_name: data.data.lastName,
          avatar_url: data.data.photo?.path,
          // Email and role are excluded based on requirements
        })
        .eq("id", data.id);

      if (error) {
        return { status: 500, data: undefined };
      }

      return { status: 200, data: undefined };
    },
    []
  );
}

export function useRecoverSupabaseAccountService() {
  return useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-change`,
      });

      if (error) {
        return { status: 500, data: undefined };
      }

      return { status: 200, data: undefined };
    },
    []
  );
}
