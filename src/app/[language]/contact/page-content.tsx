"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "@/services/i18n/client";

export default function Contact() {
  const { t } = useTranslation("contact");

  return (
    <Container maxWidth="md">
      <Stack my={16} spacing={6}>
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("title")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("description")}
            </Typography>
        </Box>

        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("sponsors.title")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("sponsors.description")}
            </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
