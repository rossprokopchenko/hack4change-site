import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { useCreateTeam } from "@/services/teams/use-teams";
import { useTranslation } from "@/services/i18n/client";

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTeamDialog({
  open,
  onClose,
}: CreateTeamDialogProps) {
  const { t } = useTranslation("profile");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createTeam = useCreateTeam();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await createTeam.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined
      });
      handleClose();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("team.createDialog.title")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label={t("team.createDialog.nameLabel")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoFocus
            error={createTeam.isError}
            helperText={
              createTeam.isError ? t("team.createDialog.nameError") : ""
            }
          />
          <TextField
            label={t("team.createDialog.descriptionLabel")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("team.createDialog.cancel")}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || createTeam.isPending}
        >
          {createTeam.isPending
            ? t("team.createDialog.creating")
            : t("team.createDialog.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
