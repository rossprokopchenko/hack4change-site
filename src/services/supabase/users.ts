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
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    photo: profile.avatar_url ? { id: "", path: profile.avatar_url } : undefined,
    role: {
      id: profile.role === 'admin' ? RoleEnum.ADMIN : RoleEnum.USER,
      name: profile.role === 'admin' ? 'Admin' : 'User',
    },
    rsvpStatus: profile.rsvp_status,
  };
}

export function useGetSupabaseUsersService() {
  return useCallback(
    async (data: UsersRequest, requestConfig?: { signal?: AbortSignal }) => {
      try {
        let query = supabase
          .from("profiles")
          .select("*", { count: "exact" });

        // Apply role filters
        if (data.filters?.roles && data.filters.roles.length > 0) {
          const roleValues = data.filters.roles.map(r => 
            Number(r.id) === RoleEnum.ADMIN ? 'admin' : 'user'
          );
          query = query.in("role", roleValues);
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
        .select("*")
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
