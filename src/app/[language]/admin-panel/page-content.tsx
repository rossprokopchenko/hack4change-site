"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function AdminPanel() {
  const { t } = useTranslation("admin-panel-home");

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md">
        <Grid container spacing={3} wrap="nowrap">
          <Grid>
            <Typography variant="h3" gutterBottom>
              {t("title")}
            </Typography>
            <Typography>{t("description")}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default withPageRequiredAuth(AdminPanel, { roles: [RoleEnum.ADMIN] });
