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
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        {t("title")}
      </Typography>

      <Box sx={{ mt: 6 }}>
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

      {/* Contact Section */}
      <Box 
        sx={{ 
          mt: 8, 
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
          <MuiLink href="mailto:contact@hack4change.ca">
            {t("stillQuestions.contact")}
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("stillQuestions.response")}
        </Typography>
      </Box>
    </Container>
  );
}
