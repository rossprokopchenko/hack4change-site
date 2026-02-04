import { useCallback } from "react";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

const supabase = supabaseClient as SupabaseClient<Database>;

export interface TeamAdmin {
  id: string;
  name: string;
  description: string | null;
  createdBy: string | null;
  createdByName?: string;
  createdAt: string;
}

export type TeamsRequest = {
  page: number;
  limit: number;
  filters?: {
    search?: {
      field: string;
      value: string;
    };
  };
  sort?: Array<{
    orderBy: keyof TeamAdmin;
    order: "asc" | "desc";
  }>;
};

export type TeamsResponse = {
  data: TeamAdmin[];
  hasNextPage: boolean;
  total: number;
};

function mapDbTeamToTeamAdmin(team: any): TeamAdmin {
  // Supabase returns joined data as an object for 1:1 or many:1 relationships
  const creatorData = Array.isArray(team.creator) ? team.creator[0] : team.creator;
  
  let createdByName = "Unknown";
  if (creatorData) {
    createdByName = `${creatorData.first_name || ""} ${creatorData.last_name || ""}`.trim();
    if (!createdByName && creatorData.email) {
      createdByName = creatorData.email;
    }
  }

  return {
    id: team.id,
    name: team.name,
    description: team.description,
    createdBy: team.created_by,
    createdByName: createdByName || "Unknown",
    createdAt: team.created_at,
  };
}

export function useGetSupabaseTeamsService() {
  return useCallback(
    async (data: TeamsRequest) => {
      try {
        let query = supabase
          .from("teams")
          .select("*, creator:profiles!created_by(first_name, last_name, email)", { count: "exact" });

        // Apply search filter
        if (data.filters?.search && data.filters.search.value) {
          const searchValue = `%${data.filters.search.value}%`;
          const fieldMap: Record<string, string> = {
            name: "name",
            description: "description",
          };
          const dbField = fieldMap[data.filters.search.field] || "name";
          query = query.ilike(dbField, searchValue);
        }

        // Apply sorting
        if (data.sort && data.sort.length > 0) {
          const sortField = data.sort[0].orderBy;
          const sortOrder = data.sort[0].order === "asc";
          
          const fieldMap: Record<string, string> = {
            id: "id",
            name: "name",
            createdAt: "created_at",
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

        const { data: teams, error, count } = await query;

        if (error) {
          console.error("Supabase error fetching teams:", error);
          return {
            status: 500,
            data: { data: [], hasNextPage: false, total: 0 },
          };
        }

        const mappedTeams = (teams || []).map(mapDbTeamToTeamAdmin);
        const hasNextPage = count ? from + data.limit < count : false;

        return {
          status: 200,
          data: {
            data: mappedTeams,
            hasNextPage,
            total: count || 0,
          },
        };
      } catch (error) {
        console.error("Error fetching teams:", error);
        return {
          status: 500,
          data: { data: [], hasNextPage: false, total: 0 },
        };
      }
    },
    []
  );
}

export function useDeleteSupabaseTeamService() {
  return useCallback(
    async (teamId: string) => {
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (error) {
        return { status: 500, data: undefined };
      }

      return { status: 200, data: undefined };
    },
    []
  );
}
