"use client";
import { useState } from "react";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useUserTeam, useLeaveTeam } from "@/services/teams/use-teams";
import { useUpdateRSVP, type RSVPStatus } from "@/services/profile/use-rsvp";
import CreateTeamDialog from "@/components/create-team-dialog";
import TeamSearch from "@/components/team-search";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
}));

const getRSVPColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "success";
    case "declined":
      return "error";
    case "pending":
      return "default";
    default:
      return "default";
  }
};

function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation("profile");
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);
  
  const { data: userTeam, isLoading: teamLoading } = useUserTeam();
  const updateRSVP = useUpdateRSVP();
  const leaveTeam = useLeaveTeam();

  const currentRSVP = (user as any)?.rsvpStatus || "pending";

  const handleRSVPChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: RSVPStatus | null
  ) => {
    if (newStatus !== null) {
      updateRSVP.mutate(newStatus);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam.mutateAsync();
      setLeaveTeamDialogOpen(false);
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", pt: 8, pb: 16 }}>
      
      <Container maxWidth="md">
        <Stack spacing={8}>
          {/* Profile Header */}
          <Grid container spacing={3} wrap="nowrap">
            <Grid size="auto">
              <StyledAvatar
                alt={user?.firstName + " " + user?.lastName}
                data-testid="user-icon"
                src={user?.photo?.path}
              />
            </Grid>
            <Grid size="grow" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="h3" gutterBottom data-testid="user-name" sx={{ textAlign: 'right' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="h5" gutterBottom data-testid="user-email" sx={{ textAlign: 'right' }}>
                {user?.email}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  LinkComponent={Link}
                  href="/profile/edit"
                  data-testid="edit-profile"
                  sx={{ mt: 2 }}
                >
                  {t("profile:actions.edit")}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          {/* RSVP Status Section */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <EventAvailableIcon color="primary" />
                <Typography variant="h5" fontWeight="bold">
                  {t("rsvp.title")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* <Box>
                  <Typography variant="body1" gutterBottom>
                    {t("rsvp.currentStatus")}:{" "}
                    <Chip
                      label={t(`rsvp.status.${currentRSVP}`)}
                      color={getRSVPColor(currentRSVP) as any}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("rsvp.description")}
                  </Typography>
                </Box> */}
                <Box>
                  <ToggleButtonGroup
                    value={currentRSVP}
                    exclusive
                    onChange={handleRSVPChange}
                    disabled={updateRSVP.isPending}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        py: 1.5,
                      },
                      '& .MuiToggleButton-root.Mui-selected': {
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <ToggleButton value="pending" color="standard">
                      {t("rsvp.status.pending")}
                    </ToggleButton>
                    <ToggleButton value="confirmed" color="success">
                      {t("rsvp.status.confirmed")}
                    </ToggleButton>
                    <ToggleButton value="declined" color="error">
                      {t("rsvp.status.declined")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Team Section */}
          {teamLoading ? (
            <Card>
              <CardContent>
                <Typography>{t("team.loading")}</Typography>
              </CardContent>
            </Card>
          ) : userTeam ? (
            // Current Team Display
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <GroupsIcon color="primary" />
                  <Typography variant="h5" fontWeight="bold">
                    {t("team.yourTeam")}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {userTeam.name}
                </Typography>
                {userTeam.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {userTeam.description}
                  </Typography>
                )}
                <Typography variant="body2" gutterBottom>
                  {t("team.yourRole")}:{" "}
                  <Chip
                    label={t(`team.role.${userTeam.userRole}`)}
                    size="small"
                    color={userTeam.userRole === "leader" ? "primary" : "default"}
                  />
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  {t("team.members")} ({userTeam.team_members?.length || 0}/
                  {userTeam.max_members}):
                </Typography>
                <List dense>
                  {userTeam.team_members?.map((member: any) => (
                    <ListItem key={member.id}>
                      <ListItemText
                        primary={`${member.profiles.first_name || ""} ${member.profiles.last_name || ""}`.trim() || member.profiles.email}
                        secondary={t(`team.role.${member.role}`)}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setLeaveTeamDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  {t("team.leaveTeam")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Team Search & Create
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <GroupsIcon color="primary" />
                  <Typography variant="h5" fontWeight="bold">
                    {t("team.findOrCreate")}
                  </Typography>
                </Box>

                {/* Search Teams */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <SearchIcon fontSize="small" />
                    <Typography variant="h6">{t("team.searchTitle")}</Typography>
                  </Box>
                  <TeamSearch />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Create Team */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <AddIcon fontSize="small" />
                    <Typography variant="h6">{t("team.createTitle")}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t("team.createDescription")}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateTeamOpen(true)}
                  >
                    {t("team.createButton")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
      </Stack>

    </Container>

        {/* Create Team Dialog */}
        <CreateTeamDialog
          open={createTeamOpen}
          onClose={() => setCreateTeamOpen(false)}
        />

        {/* Leave Team Confirmation Dialog */}
        <Dialog
          open={leaveTeamDialogOpen}
          onClose={() => setLeaveTeamDialogOpen(false)}
        >
          <DialogTitle>{t("team.leaveDialog.title")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("team.leaveDialog.message")}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLeaveTeamDialogOpen(false)}>
              {t("team.leaveDialog.cancel")}
            </Button>
            <Button
              onClick={handleLeaveTeam}
              color="error"
              variant="contained"
              disabled={leaveTeam.isPending}
            >
              {leaveTeam.isPending
                ? t("team.leaveDialog.leaving")
                : t("team.leaveDialog.leave")}
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}

export default withPageRequiredAuth(Profile);
