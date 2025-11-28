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
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 8, pb: 16 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <HeroMotion 
          subtitle={t("subtitle")}
          subheadline={t("subheadline")}
        >
          {t("title")}
        </HeroMotion>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <PublicIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      {t("valueProps.realWorldImpact.title")}
                    </Typography>
                  </Box>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <CodeIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      {t("valueProps.codeGoesLive.title")}
                    </Typography>
                  </Box>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <EmojiEventsIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      {t("valueProps.prizesRecognition.title")}
                    </Typography>
                  </Box>
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
        pt: 8
      })}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <CalendarTodayIcon sx={{ fontSize: 48, mb: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.dates")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <LocationOnIcon sx={{ fontSize: 48, mb: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.location")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <PeopleIcon sx={{ fontSize: 48, mb: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.participants")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <AttachMoneyIcon sx={{ fontSize: 48, mb: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {t("quickFacts.prizePool")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}