"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MuiLink from "@mui/material/Link";
import Link from "@/components/link";
import Divider from "@mui/material/Divider";

export default function Contact() {
  const { t } = useTranslation("contact");

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        {t("title")}
      </Typography>

      {/* Participants Section */}
      <Card sx={{ mt: 6, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {t("participants.title")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("participants.intro")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("participants.registration")}
          </Typography>
          <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1, my: 2 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              [{t("participants.emailSignup")}]
            </Typography>
          </Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            {t("participants.questions")}
          </Typography>
          <Typography variant="body2">
            <MuiLink href="mailto:contact@hack4change.ca">
              {t("participants.email")}
            </MuiLink>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t("participants.faqLink")} <Link href="/faq"><MuiLink component="span">FAQ page</MuiLink></Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Sponsors Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {t("sponsors.title")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("sponsors.intro")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("sponsors.description")}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {t("sponsors.prospectus")}
          </Typography>
          <Typography variant="body2" paragraph>
            [{t("sponsors.prospectusLink")}]
          </Typography>
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
        </CardContent>
      </Card>

      {/* Media Inquiries */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
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
        </CardContent>
      </Card>

      {/* General Questions */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
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
        </CardContent>
      </Card>

      <Divider sx={{ my: 6 }} />

      {/* Stay Connected */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          {t("stayConnected.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("stayConnected.intro")}
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1, my: 2, maxWidth: "400px", mx: "auto" }}>
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
      </Box>

      {/* Event Location */}
      <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          {t("eventLocation.title")}
        </Typography>
        <Typography variant="body1" textAlign="center" fontWeight="bold">
          {t("eventLocation.name")}
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ whiteSpace: "pre-line", mt: 1 }}>
          {t("eventLocation.address")}
        </Typography>
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            [{t("eventLocation.map")}]
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
          {t("eventLocation.note")}
        </Typography>
      </Box>
    </Container>
  );
}
