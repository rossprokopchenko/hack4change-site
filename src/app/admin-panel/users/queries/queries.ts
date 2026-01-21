import { useGetSupabaseUsersService } from "@/services/supabase/users";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { UserFilterType, UserSortType } from "../user-filter-types";

export const usersQueryKeys = createQueryKeys(["users"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: UserFilterType | undefined;
        sort?: UserSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useGetUsersQuery = ({
  sort,
  filter,
  page = 1,
  limit = 15,
}: {
  filter?: UserFilterType | undefined;
  sort?: UserSortType | undefined;
  page?: number;
  limit?: number;
} = {}) => {
  const fetch = useGetSupabaseUsersService();

  const query = useQuery({
    queryKey: [...usersQueryKeys.list().sub.by({ sort, filter }).key, page, limit],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const { status, data } = await fetch(
        {
          page,
          limit,
          filters: {
            ...filter,
            search: filter?.searchField && filter?.searchValue 
              ? { field: filter.searchField, value: filter.searchValue }
              : undefined,
          },
          sort: sort ? [sort] : undefined,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          total: data.total,
        };
      }
    },
    gcTime: 0,
  });

  return query;
};
