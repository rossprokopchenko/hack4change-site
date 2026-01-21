"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useGetUsersQuery, usersQueryKeys } from "./queries/queries";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import { User } from "@/services/api/types/user";
import Link from "@/components/link";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  useDeleteSupabaseUserService,
  useGetSupabaseUsersService,
} from "@/services/supabase/users";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import UserFilter from "./user-filter";
import { useRouter, useSearchParams } from "next/navigation";
import TableSortLabel from "@mui/material/TableSortLabel";
import { UserFilterType, UserSortType } from "./user-filter-types";
import { SortEnum } from "@/services/api/types/sort-type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { utils, writeFile } from "xlsx";

type UsersKeys = keyof User;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: UsersKeys;
    order: SortEnum;
    column: UsersKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: UsersKeys
    ) => void;
  }>
) {
  return (
    <TableCell
      style={{ width: props.width }}
      sortDirection={props.orderBy === props.column ? props.order : false}
    >
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function Actions({ user }: { user: User }) {
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchUserDelete = useDeleteSupabaseUserService();
  const queryClient = useQueryClient();
  const { t: tUsers } = useTranslation("admin-panel-users");

  const isCurrentUser = user.id === authUser?.id;
  const isTargetAdmin = Number(user?.role?.id) === RoleEnum.ADMIN;
  const canEdit = !isTargetAdmin || isCurrentUser; // Can't edit other admins
  const canDelete = !isCurrentUser && !isTargetAdmin; // Can't delete self or other admins

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tUsers("admin-panel-users:confirm.delete.title"),
      message: tUsers("admin-panel-users:confirm.delete.message"),
    });

    if (isConfirmed) {
      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");

      let filter: UserFilterType | undefined = undefined;
      let sort: UserSortType | undefined = {
        order: SortEnum.DESC,
        orderBy: "id",
      };

      if (searchParamsFilter) {
        filter = JSON.parse(searchParamsFilter);
      }

      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }

      const previousData = queryClient.getQueryData<
        InfiniteData<{ nextPage: number; data: User[] }>
      >(usersQueryKeys.list().sub.by({ sort, filter }).key);

      await queryClient.cancelQueries({ queryKey: usersQueryKeys.list().key });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== user.id),
        })),
      };

      queryClient.setQueryData(
        usersQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchUserDelete(user.id);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {canEdit && (
        <Tooltip title={tUsers("admin-panel-users:actions.edit")}>
          <IconButton
            size="small"
            color="primary"
            component={Link}
            href={`/admin-panel/users/edit/${user.id}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {canDelete && (
        <Tooltip title={tUsers("admin-panel-users:actions.delete")}>
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const { t: tRoles } = useTranslation("admin-panel-roles");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: UsersKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  const [searchField, setSearchField] = useState<string>("email");
  const [searchValue, setSearchValue] = useState<string>("");

  // Auto-search with 2-second debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        handleSearchApply();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchValue, searchField]);

  const handleSearchApply = () => {
    const currentFilter = filter || {};
    const newFilter = {
      ...currentFilter,
      searchField,
      searchValue,
    };
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("filter", JSON.stringify(newFilter));
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const handleReset = () => {
    // Clear local search state
    setSearchField("email");
    setSearchValue("");
    
    // Clear URL params
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("filter");
    searchParams.delete("sort");
    router.push(window.location.pathname + (searchParams.toString() ? "?" + searchParams.toString() : ""));
  };

  const fetchUsers = useGetSupabaseUsersService();
  const handleExport = async () => {
    const { data: allUsersData } = await fetchUsers({
      page: 1,
      limit: 10000,
      filters: {
        ...filter,
        search: filter?.searchField && filter?.searchValue 
          ? { field: filter.searchField, value: filter.searchValue }
          : undefined,
      },
      sort: [{ order, orderBy }],
    });

    if (allUsersData?.data) {
      const exportData = allUsersData.data.map((user: User) => ({
        [tUsers("admin-panel-users:table.column1")]: user.firstName,
        [tUsers("admin-panel-users:table.column2")]: user.lastName,
        [tUsers("admin-panel-users:table.column3")]: user.email,
        [tUsers("admin-panel-users:table.column4")]: user.rsvpStatus,
        [tUsers("admin-panel-users:table.column6")]: user.teamName ?? "none",
        [tUsers("admin-panel-users:table.column5")]: new Date(user.createdAt).toLocaleDateString(),
      }));

      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Users");
      const date = new Date().toISOString().split('T')[0];
      writeFile(wb, `hack4change-users_${date}.xlsx`);
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: UsersKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as UserFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, isLoading } = useGetUsersQuery({
    filter,
    sort: { order, orderBy },
    page: page + 1,
    limit: rowsPerPage,
  });

  const handleChangePage = (event: unknown, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const result = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <Container maxWidth="xl" sx={{ pt: 8, pb: 16 }}>
      <Grid container spacing={3}>
        {/* Title Row */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h3">
            {tUsers("admin-panel-users:title")}
          </Typography>
        </Grid>

        {/* Search Section with Filter Button */}
        <Grid container size={{ xs: 12 }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Search Value - First */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label={tUsers("admin-panel-users:filter.inputs.searchValue.label")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchApply();
                }
              }}
            />
          </Grid>
          {/* Search By - Second */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={tUsers("admin-panel-users:filter.inputs.searchField.label")}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <MenuItem value="firstName">{tUsers("admin-panel-users:filter.inputs.searchField.options.firstName")}</MenuItem>
              <MenuItem value="lastName">{tUsers("admin-panel-users:filter.inputs.searchField.options.lastName")}</MenuItem>
              <MenuItem value="email">{tUsers("admin-panel-users:filter.inputs.searchField.options.email")}</MenuItem>
              <MenuItem value="team">{tUsers("admin-panel-users:filter.inputs.searchField.options.team")}</MenuItem>
            </TextField>
          </Grid>
          {/* Filter - Third */}
          <Grid size={{ xs: 6, sm: "auto" }}>
            <UserFilter />
          </Grid>
          {/* Reset - Last */}
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button variant="outlined" onClick={handleReset}>
              {tUsers("admin-panel-users:filter.actions.reset")}
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button variant="outlined" onClick={handleExport} color="success">
              {tUsers("admin-panel-users:filter.actions.export")}
            </Button>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }} mb={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="firstName"
                    handleRequestSort={handleRequestSort}
                  >
                    {tUsers("admin-panel-users:table.column1")}
                  </TableSortCellWrapper>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="lastName"
                    handleRequestSort={handleRequestSort}
                  >
                    {tUsers("admin-panel-users:table.column2")}
                  </TableSortCellWrapper>
                  <TableCell>{tUsers("admin-panel-users:table.column3")}</TableCell>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="rsvpStatus"
                    handleRequestSort={handleRequestSort}
                  >
                    {tUsers("admin-panel-users:table.column4")}
                  </TableSortCellWrapper>
                  <TableCell>{tUsers("admin-panel-users:table.column6")}</TableCell>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="createdAt"
                    handleRequestSort={handleRequestSort}
                  >
                    {tUsers("admin-panel-users:table.column5")}
                  </TableSortCellWrapper>
                  <TableCell sx={{ minWidth: 100 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  result.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={user.photo?.path}
                            sx={{ mr: 2, width: 32, height: 32 }}
                          />
                          {user.firstName}
                        </Box>
                      </TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.rsvpStatus}</TableCell>
                      <TableCell>{user.teamName ?? "none"}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            href={`/admin-panel/users/edit/${user.id}`}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" color="text.secondary">
              {tUsers("admin-panel-users:total_count", { count: total })}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Users, { roles: [RoleEnum.ADMIN] });
