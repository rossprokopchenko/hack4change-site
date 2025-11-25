"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import HeroMotion from "@/components/hero-motion";
import Link from "@/components/link";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 16 }}>
        <HeroMotion subtitle={t("subtitle")}>
          {t("title")}
        </HeroMotion>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 4, 
            textAlign: "center",
            maxWidth: "900px",
            mx: "auto",
            lineHeight: 1.6
          }}
        >
          {t("subheadline")}
        </Typography>
      </Container>

      {/* Value Proposition Cards */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {t("valueProps.realWorldImpact.icon")}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t("valueProps.realWorldImpact.title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("valueProps.realWorldImpact.description")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {t("valueProps.codeGoesLive.icon")}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t("valueProps.codeGoesLive.title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("valueProps.codeGoesLive.description")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {t("valueProps.prizesRecognition.icon")}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t("valueProps.prizesRecognition.title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("valueProps.prizesRecognition.description")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call-to-Action Buttons */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            href="/contact"
            sx={{ px: 4, py: 1.5 }}
          >
            {t("cta.registerInterest")}
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            component={Link}
            href="/sponsors"
            sx={{ px: 4, py: 1.5 }}
          >
            {t("cta.sponsorshipOpportunities")}
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            component={Link}
            href="/about"
            sx={{ px: 4, py: 1.5 }}
          >
            {t("cta.learnMore")}
          </Button>
        </Box>
      </Container>

      {/* Quick Facts */}
      <Box sx={(theme) => ({ 
        pt: 8,
        pb: 16
      })}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>📅</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.dates")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>📍</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.location")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>👥</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.participants")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>💰</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.prizePool")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}