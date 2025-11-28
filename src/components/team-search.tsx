import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchTeams, useJoinTeam } from "@/services/teams/use-teams";
import { useTranslation } from "@/services/i18n/client";

export default function TeamSearch() {
  const { t } = useTranslation("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: teams, isLoading } = useSearchTeams(searchQuery);
  const joinTeam = useJoinTeam();

  const handleJoinTeam = async (teamId: string) => {
    try {
      await joinTeam.mutateAsync(teamId);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  // Show "No teams found" when there's a search but no results
  const options = teams && teams.length === 0 && searchQuery.length > 0 
    ? [{ id: 'no-results', name: 'No teams found', description: null, max_members: 0, team_members: [] }] 
    : teams || [];

  return (
    <Box>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        loading={isLoading}
        onInputChange={(_, value) => setSearchQuery(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("team.search.label")}
            placeholder={t("team.search.placeholder")}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option: any) => {
          // Special handling for "No teams found" entry
          if (option.id === 'no-results') {
            return (
              <Box
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  py: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No teams found
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {option.name}
                </Typography>
                {option.description && (
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {option.team_members?.[0]?.count || 0}/{option.max_members}{" "}
                  {t("team.search.members")}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinTeam(option.id);
                }}
                disabled={joinTeam.isPending}
              >
                {t("team.search.join")}
              </Button>
            </Box>
          );
        }}
        noOptionsText={
          searchQuery.length > 0
            ? t("team.search.noResults")
            : t("team.search.startTyping")
        }
      />
    </Box>
  );
}
