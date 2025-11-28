"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import Link from "@/components/link";
import Divider from "@mui/material/Divider";
import VennInnovationEmbed from "@/components/venn-innovation-embed";

export default function Contact() {
  const { t } = useTranslation("contact");

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 8, pb: 16 }}>
      <Container maxWidth="lg">
        <Stack spacing={8}>
          
          {/* Header */}
          <Box textAlign="center" mx="auto">
            <Typography variant="h3" component="h1" gutterBottom>
              {t("title")}
            </Typography>
          </Box>

          <Divider />

          {/* Participants Section */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("participants.title")}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mt: 3 }}>
              {t("participants.questions")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t("participants.faqLink")} <Link href="/faq"><MuiLink component="span">FAQ page</MuiLink></Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <MuiLink href="mailto:contact@hack4change.ca">
                {t("participants.email")}
              </MuiLink>
            </Typography>
          </Box>

          <Divider />

          {/* Sponsors Section */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("sponsors.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("sponsors.intro")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("sponsors.description")}
            </Typography>
            {/* <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              {t("sponsors.prospectus")}
            </Typography>
            <Typography variant="body2" paragraph>
              [{t("sponsors.prospectusLink")}]
            </Typography> */}
            <Typography variant="subtitle2" gutterBottom>
              {t("sponsors.discuss")}
            </Typography>
            <Typography variant="body2">
              <MuiLink href="mailto:contact@hack4change.ca">
                {t("sponsors.email")}
              </MuiLink>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t("sponsors.meeting")}
            </Typography>
          </Box>

          <Divider />

          {/* Media Inquiries */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("media.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("media.intro")}
            </Typography>
            <Typography variant="body2">
              <MuiLink href="mailto:contact@hack4change.ca">
                {t("media.email")}
              </MuiLink>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t("media.info")}
            </Typography>
          </Box>

          <Divider />

          {/* General Questions */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("general.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("general.intro")}
            </Typography>
            <Typography variant="body2">
              <MuiLink href="mailto:contact@hack4change.ca">
                {t("general.email")}
              </MuiLink>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t("general.response")}
            </Typography>
          </Box>
{/* 
          <Divider /> */}

          {/* Stay Connected */}
          {/* <Box textAlign="center">
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("stayConnected.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("stayConnected.intro")}
            </Typography>
            <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, my: 3, maxWidth: "500px", mx: "auto", borderLeft: 4, borderColor: 'primary.main' }}>
              <Typography variant="body2" color="text.secondary">
                [{t("stayConnected.emailSignup")}]
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t("stayConnected.description")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <MuiLink href="mailto:contact@hack4change.ca">
                {t("stayConnected.email")}
              </MuiLink>
            </Typography>
          </Box> */}
        </Stack>
      </Container>
    </Box>
  );
}
