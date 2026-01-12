"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";

export default function PrivacyPolicy() {
  const { t } = useTranslation("privacy-policy");

  const sections = t("sections", { returnObjects: true }) as Array<{
    title: string;
    content?: string;
    items?: string[];
    additional?: string;
    additionalItems?: string[];
    categories?: Array<{ title: string; items: string[] }>;
  }>;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {t("title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t("lastUpdated")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("intro")}
      </Typography>

      {sections.map((section, index) => (
        <Box key={index} sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            {section.title}
          </Typography>
          
          {section.content && (
            <Typography variant="body1" paragraph>
              {section.content}
            </Typography>
          )}

          {section.items && (
            <Box component="ul" sx={{ pl: 3 }}>
              {section.items.map((item, i) => (
                <Typography component="li" key={i} sx={{ mb: 0.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          )}

          {section.additional && (
            <>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {section.additional}
              </Typography>
              {section.additionalItems && (
                <Box component="ul" sx={{ pl: 3 }}>
                  {section.additionalItems.map((item, i) => (
                    <Typography component="li" key={i} sx={{ mb: 0.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              )}
            </>
          )}

          {section.categories && section.categories.map((category, catIndex) => (
            <Box key={catIndex} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {category.title}
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                {category.items.map((item, i) => (
                  <Typography component="li" key={i} sx={{ mb: 0.5 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      {/* Contact Info */}
      <Box sx={{ mt: 12, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("contactInfo.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("contactInfo.content")}
        </Typography>
        <Typography variant="body2">
          <MuiLink href="mailto:contact@hack4change.ca" sx={{ fontWeight: "bold" }}>
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
    </Container>
  );
}
