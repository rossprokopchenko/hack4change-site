"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";

export default function CodeOfConduct() {
  const { t } = useTranslation("code-of-conduct");

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {t("title")}
      </Typography>

      <Typography variant="body1" paragraph sx={{ mt: 3 }}>
        {t("intro")}
      </Typography>

      {/* Our Standards */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {t("standards.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("standards.intro")}
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          {(t("standards.items", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Unacceptable Behavior */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {t("unacceptable.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("unacceptable.intro")}
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          {(t("unacceptable.items", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Scope */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {t("scope.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("scope.intro")}
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          {(t("scope.items", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Reporting */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {t("reporting.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("reporting.intro")}
        </Typography>
        
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t("reporting.steps.0.title")}
          </Typography>
          <Typography variant="body2">
            {t("reporting.steps.0.description")}
          </Typography>
        </Alert>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t("reporting.steps.1.title")}
          </Typography>
          <Typography variant="body2">
            {t("reporting.steps.1.description")}
          </Typography>
        </Alert>

        <Typography variant="body1" paragraph>
          {t("reporting.confidentiality")}
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          {t("reporting.whatToInclude.title")}
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          {(t("reporting.whatToInclude.items", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Enforcement */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {t("enforcement.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("enforcement.intro")}
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          {(t("enforcement.actions", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {t("enforcement.priority")}
        </Typography>
      </Box>

      {/* Attribution */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          {t("attribution.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("attribution.text")}
        </Typography>
      </Box>

      {/* Contact Info */}
      <Box sx={{ mt: 12, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("contactInfo.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("contactInfo.content")}
        </Typography>
        <Typography variant="body2">
          <MuiLink href="mailto:contact@hack4change.ca">
            {t("contactInfo.email")}
          </MuiLink>
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {t("contactInfo.organization")}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {t("contactInfo.address")}
        </Typography>
      </Box>

      {/* Agreement */}
      <Alert severity="info" sx={{ mt: 5 }}>
        <Typography variant="body2">
          {t("agreement")}
        </Typography>
      </Alert>
    </Container>
  );
}
