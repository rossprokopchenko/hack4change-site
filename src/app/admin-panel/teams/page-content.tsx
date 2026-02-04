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
  useMemo,
  useState,
  useEffect,
} from "react";
import { useGetTeamsQuery, teamsQueryKeys } from "./queries/queries";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import { TeamAdmin, useDeleteSupabaseTeamService } from "@/services/supabase/teams-admin";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import TableSortLabel from "@mui/material/TableSortLabel";
import { SortEnum } from "@/services/api/types/sort-type";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { utils, writeFile } from "xlsx";

type TeamsKeys = keyof TeamAdmin;

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: TeamsKeys;
    order: SortEnum;
    column: TeamsKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: TeamsKeys
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

function Teams() {
  const { t: tTeams } = useTranslation("admin-panel-teams");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { confirmDialog } = useConfirmDialog();
  const deleteTeam = useDeleteSupabaseTeamService();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: TeamsKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "createdAt" };
  });

  const [searchField, setSearchField] = useState<string>("name");
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        handleSearchApply();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchValue, searchField]);

  const handleSearchApply = () => {
    const newFilter = {
      searchField,
      searchValue,
    };
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("filter", JSON.stringify(newFilter));
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const handleReset = () => {
    setSearchField("name");
    setSearchValue("");
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("filter");
    searchParams.delete("sort");
    router.push(window.location.pathname + (searchParams.toString() ? "?" + searchParams.toString() : ""));
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return undefined;
  }, [searchParams]);

  const { data, isLoading } = useGetTeamsQuery({
    page: page + 1,
    limit: rowsPerPage,
    filters: filter,
    sort: [{ order, orderBy }],
  });

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirmDialog({
      title: tTeams("admin-panel-teams:confirm.delete.title"),
      message: tTeams("admin-panel-teams:confirm.delete.message"),
    });

    if (isConfirmed) {
      await deleteTeam(id);
      queryClient.invalidateQueries({ queryKey: teamsQueryKeys.list() });
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: TeamsKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({ order: newOrder, orderBy: newOrderBy });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const handleExport = () => {
    if (data?.data) {
      const exportData = data.data.map((team: TeamAdmin) => ({
        [tTeams("admin-panel-teams:table.column1")]: team.name,
        [tTeams("admin-panel-teams:table.column2")]: team.description,
        [tTeams("admin-panel-teams:table.column3")]: team.createdByName,
        [tTeams("admin-panel-teams:table.column4")]: new Date(team.createdAt).toLocaleDateString(),
      }));

      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Teams");
      writeFile(wb, `hack4change-teams_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  const total = data?.total ?? 0;
  const result = data?.data ?? [];

  return (
    <Container maxWidth="xl" sx={{ pt: 8, pb: 16 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h3">{tTeams("admin-panel-teams:title")}</Typography>
        </Grid>

        <Grid container size={{ xs: 12 }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label={tTeams("admin-panel-teams:filter.inputs.searchValue.label")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={tTeams("admin-panel-teams:filter.inputs.searchField.label")}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <MenuItem value="name">{tTeams("admin-panel-teams:filter.inputs.searchField.options.name")}</MenuItem>
              <MenuItem value="description">{tTeams("admin-panel-teams:filter.inputs.searchField.options.description")}</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button variant="outlined" onClick={handleReset}>{tTeams("admin-panel-teams:filter.actions.reset")}</Button>
          </Grid>
          <Grid size={{ xs: 6, sm: "auto" }}>
            <Button variant="outlined" color="success" onClick={handleExport}>{tTeams("admin-panel-teams:filter.actions.export")}</Button>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }} mb={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableSortCellWrapper orderBy={orderBy} order={order} column="name" handleRequestSort={handleRequestSort}>
                    {tTeams("admin-panel-teams:table.column1")}
                  </TableSortCellWrapper>
                  <TableCell>{tTeams("admin-panel-teams:table.column2")}</TableCell>
                  <TableCell>{tTeams("admin-panel-teams:table.column3")}</TableCell>
                  <TableSortCellWrapper orderBy={orderBy} order={order} column="createdAt" handleRequestSort={handleRequestSort}>
                    {tTeams("admin-panel-teams:table.column4")}
                  </TableSortCellWrapper>
                  <TableCell align="right">{tTeams("admin-panel-teams:table.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5}><LinearProgress /></TableCell></TableRow>
                ) : (
                  result.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.description}</TableCell>
                      <TableCell>{team.createdByName}</TableCell>
                      <TableCell>{new Date(team.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(team.id)} color="error"><DeleteIcon /></IconButton>
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
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Teams, { roles: [RoleEnum.ADMIN] });
