"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import { useColorScheme } from "@mui/material/styles";

export default function Sponsors() {
  const { t } = useTranslation("sponsors");
  const { mode } = useColorScheme();

  const tiers = ["title", "gold", "silver", "bronze", "community"];

  // Color mapping for sponsor tiers
  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      title: "#FFD700",     // Gold
      gold: "#FFD700",      // Gold
      silver: "#C0C0C0",    // Silver
      bronze: "#CD7F32",    // Bronze
      community: "primary.main", // Theme primary color
    };
    return colors[tier] || "text.primary";
  };

  // Special styling for title sponsor
  const getTierStyle = (tier: string) => {
    if (tier === "title") {
      return {
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
        filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))",
      };
    }
    return { color: getTierColor(tier) };
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 8, pb: 16 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        {t("title")}
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: "800px", mx: "auto" }}>
        {t("subtitle")}
      </Typography>

      <Divider />

      {/* Why Sponsor */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          {t("whySponsor.title")}
        </Typography>

        {/* Tech Companies */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          {t("whySponsor.techCompanies.title")}
        </Typography>
        {(t("whySponsor.techCompanies.benefits", { returnObjects: true }) as Array<{ title: string; items: string[] }>).map((benefit, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {benefit.items.map((item, i) => (
                <Typography component="li" key={i} sx={{ mb: 0.5 }} variant="body1">{item}</Typography>
              ))}
            </Box>
          </Box>
        ))}

        {/* Corporate Sponsors */}
        <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
          {t("whySponsor.corporate.title")}
        </Typography>
        {(t("whySponsor.corporate.benefits", { returnObjects: true }) as Array<{ title: string; items: string[] }>).map((benefit, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {benefit.items.map((item, i) => (
                <Typography component="li" key={i} sx={{ mb: 0.5 }} variant="body1">{item}</Typography>
              ))}
            </Box>
          </Box>
        ))}

        {/* Local Businesses */}
        <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
          {t("whySponsor.local.title")}
        </Typography>
        <Typography variant="body1">{t("whySponsor.local.description")}</Typography>
      </Box>

      {/* Differentiator */}
      <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          {t("differentiator.title")}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t("differentiator.subtitle")}
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 2 }}>
          {(t("differentiator.benefits", { returnObjects: true }) as string[]).map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 1 }} variant="body1">{item}</Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: "medium" }}>
          {t("differentiator.closing")}
        </Typography>
      </Box>

      <Divider />

      {/* Sponsorship Tiers */}
      <Typography variant="h4" gutterBottom sx={{ mt: 6,mb: 4 }}>
        {t("tiers.title")}
      </Typography>

      {tiers.map((tier) => (
        <Card key={tier} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight="bold"
              sx={getTierStyle(tier)}
            >
              {t(`tiers.levels.${tier}.tier`)} — {t(`tiers.levels.${tier}.price`)}
            </Typography>
            {t(`tiers.levels.${tier}.limit`, { defaultValue: '' }) && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                *{t(`tiers.levels.${tier}.limit`)}*
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
              {t(`tiers.levels.${tier}.idealFor`)}
            </Typography>
            {t(`tiers.levels.${tier}.note`, { defaultValue: '' }) && (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{t(`tiers.levels.${tier}.note`)}</Typography>
            )}
            <Box component="ul" sx={{ pl: 3 }}>
              {(t(`tiers.levels.${tier}.benefits`, { returnObjects: true }) as string[]).map((benefit, index) => (
                <Typography component="li" key={index} sx={{ mb: 0.5 }} variant="body1">
                  {benefit}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}


      {/* Additional Opportunities */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          {t("additional.title")}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("additional.meal.title")} — {t("additional.meal.price")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("additional.meal.description")}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("additional.swag.title")} — {t("additional.swag.price")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("additional.swag.description")}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("additional.custom.title")}
          </Typography>
          <Typography variant="body1">
            {t("additional.custom.description")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Next Steps */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t("nextSteps.title")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
          {(t("nextSteps.steps", { returnObjects: true }) as Array<{ number: string; title: string; description: string; action?: string; contact?: string }>).map((step) => (
            <Card key={step.number}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {step.number}. {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
                {step.contact && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <MuiLink href="mailto:contact@hack4change.ca" sx={{ fontWeight: "bold" }}>{step.contact}</MuiLink>
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Current Sponsors */}
      <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t("currentSponsors.title")}
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
          {t("currentSponsors.description")}
        </Typography>
        
        {/* Sponsor Logos */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
          mt: 8 
        }}>
          
          
          {/* GMHSC Logo */}
          <Box 
            component="img"
            src="/Logos/gmhsc_light.png"
            alt="Greater Moncton Homelessness Steering Committee"
            className="logo-light"
            sx={{
              maxWidth: '350px',
              width: '100%',
              height: 'auto'
            }}
          />
          <Box 
            component="img"
            src="/Logos/gmhsc_dark.png"
            alt="Greater Moncton Homelessness Steering Committee"
            className="logo-dark"
            sx={{
              maxWidth: '350px',
              width: '100%',
              height: 'auto'
            }}
          />
          
          {/* UnitedWay Logo */}
          <Box 
            component="img"
            src="/Logos/UnitedWay_light.png"
            alt="United Way"
            className="logo-light"
            sx={{
              maxWidth: '300px',
              width: '100%',
              height: 'auto'
            }}
          />
          <Box 
            component="img"
            src="/Logos/UnitedWay_dark.png"
            alt="United Way"
            className="logo-dark"
            sx={{
              maxWidth: '300px',
              width: '100%',
              height: 'auto'
            }}
          />
        </Box>
        
        {/* <Typography variant="subtitle2" textAlign="center" sx={{ mt: 3 }}>
          {t("currentSponsors.interested")}
        </Typography> */}
      </Box>
    </Container>
  );
}
