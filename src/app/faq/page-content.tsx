"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/material";

export default function FAQ() {
  const { t } = useTranslation("faq");

  const categories = [
    "registration",
    "challenge",
    "deployment",
    "logistics",
    "judging",
    "mentorship"
  ];

  return (
    <Container maxWidth="md" sx={{ pt: 8, pb: 16 }}>
      <Stack spacing={8}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          {t("title")}
        </Typography>

        <Divider />

        <Box>
          {categories.map((category) => {
            const questions = t(`categories.${category}.questions`, { returnObjects: true }) as Array<{ q: string; a: string }>;
            
            return (
              <Box key={category} sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
                  {t(`categories.${category}.title`)}
                </Typography>

                {questions.map((item, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${category}-${index}-content`}
                      id={`${category}-${index}-header`}
                    >
                      <Typography fontWeight="medium">{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography 
                        sx={{ whiteSpace: "pre-line" }}
                        color="text.secondary"
                      >
                        {item.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            );
          })}
        </Box>

        <Divider />

        {/* Contact Section */}
        <Box 
          sx={{
            p: 4, 
            bgcolor: "background.paper",
            borderRadius: 2,
            textAlign: "center"
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("stillQuestions.title")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <MuiLink href="mailto:contact@hack4change.ca" sx={{ fontWeight: "bold" }}>
              {t("stillQuestions.contact")}
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("stillQuestions.response")}
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
