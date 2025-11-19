"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import { useTranslation } from "@/services/i18n/client";
import { Trans } from "react-i18next/TransWithoutContext";

export default function Contact() {
  const { t } = useTranslation("contact");

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md">
        <Stack my={16} spacing={6}>
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("title")}
            </Typography>

            <Typography variant="body1" paragraph>
              <Trans
                i18nKey="description"
                ns="contact"
                components={{
                  emailLink: <MuiLink href="mailto:contact@hack4change.ca" underline="hover" />
                }}
              />
            </Typography>
        </Box>

        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("sponsors.title")}
            </Typography>

            <Typography variant="body1" paragraph>
              <Trans
                i18nKey="sponsors.description"
                ns="contact"
                components={{
                  emailLink: <MuiLink href="mailto:contact@hack4change.ca" underline="hover" />
                }}
              />
            </Typography>
        </Box>
      </Stack>
    </Container>
    </Box>
  );
}
