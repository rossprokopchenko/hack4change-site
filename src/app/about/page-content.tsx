"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MuiLink from "@mui/material/Link";
import VennInnovationEmbed from "@/components/venn-innovation-embed";

export default function About() {
  const { t } = useTranslation("about");

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 8, pb: 16 }}>
      <Container maxWidth="lg">
        <Stack spacing={8}>
          
          {/* Header & Opening */}
          <Box textAlign="center" mx="auto">
            <Typography variant="h3" component="h1" gutterBottom>
              {t("title")}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {t("opening")}
            </Typography>
          </Box>

          <Divider />

          {/* What Makes This Different */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("whatMakesDifferent.title")}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {t("whatMakesDifferent.subtitle")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("whatMakesDifferent.description")}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
              {(t("whatMakesDifferent.benefits", { returnObjects: true }) as string[]).map((benefit, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-', gap: 1 }}>
                    <Typography color="primary" fontWeight="bold">✓</Typography>
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              {t("whatMakesDifferent.closing")}
            </Typography>
          </Box>

          <Divider />

          {/* The Challenge */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("challenge.title")}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="bold">
              {t("challenge.partner")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("challenge.description")}
            </Typography>
            
            <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, borderLeft: 4, borderColor: 'primary.main' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("challenge.mission")}
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {(t("challenge.objectives", { returnObjects: true }) as string[]).map((objective, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ mb: 1 }}>
                    {objective}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Stack spacing={2}>
              <Alert severity="info" variant="outlined">
                <Typography variant="body1">
                  <strong>{t("challenge.reveal").split(':')[0]}:</strong> {t("challenge.reveal").split(':')[1]}
                </Typography>
              </Alert>
              <Alert severity="warning" variant="outlined">
                <Typography variant="body1">
                  {t("challenge.transparency")}
                </Typography>
              </Alert>
            </Stack>
          </Box>

          {/* Why This Matters */}
          <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("whyMatters.title")}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {t("whyMatters.description")}
            </Typography>
          </Box>

          <Divider />

          {/* Event Details */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("event.title")}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarTodayIcon color="primary" />
                      <Typography variant="h6" color="primary">{t("event.when.title")}</Typography>
                    </Box>
                    <Typography variant="body1">{t("event.when.description")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOnIcon color="primary" />
                      <Typography variant="h6" color="primary">{t("event.where.title")}</Typography>
                    </Box>
                    <MuiLink
                      href="https://maps.google.com/maps?ll=46.08437,-64.811657&z=13&t=m&hl=en&gl=CA&mapclient=embed&cid=3077076374376948810"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {t("event.where.description")}
                    </MuiLink>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PeopleIcon color="primary" />
                      <Typography variant="h6" color="primary">{t("event.who.title")}</Typography>
                    </Box>
                    <Typography variant="body1">{t("event.who.description")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              {t("event.schedule.title")}
            </Typography>
            <Stack spacing={3}>
              {['friday', 'saturday', 'sunday'].map((day) => (
                <Box key={day}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EventNoteIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {t(`event.schedule.${day}.title`)}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                    {(t(`event.schedule.${day}.items`, { returnObjects: true }) as string[]).map((item, i) => (
                      <Typography component="li" key={i} variant="body1" sx={{ mb: 0.5 }}>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {t("event.schedule.note")}
              </Typography>
            </Stack>

            {/* Event Location */}
            <Box sx={{ bgcolor: "background.paper", mt: 4, borderRadius: 4 }}>
                <VennInnovationEmbed />
            </Box>
          </Box>

          <Divider />

          {/* Who Should Participate */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("whoShould.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("whoShould.intro")}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {(t("whoShould.profiles", { returnObjects: true }) as string[]).map((profile, index) => (
                <Chip key={index} label={profile} sx={{ fontSize: '1rem', py: 2 }} />
              ))}
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontStyle="italic">
                    {t("whoShould.note")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Prizes */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("prizes.title")}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {t("prizes.prizePool")}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {t("prizes.beyond")}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {(t("prizes.benefits", { returnObjects: true }) as string[]).map((benefit, index) => (
                <Typography component="li" key={index} variant="body1" sx={{ mb: 1 }}>
                  {benefit}
                </Typography>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t("prizes.note")}
            </Typography>
          </Box>

          <Divider />

          {/* Partners */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("partners.title")}
            </Typography>
            <Stack spacing={4} sx={{ mt: 3 }}>
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {t("partners.gmhsc.title")}
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {t("partners.gmhsc.description")}
                </Typography>
                <MuiLink href="https://www.monctonhomelessness.org/" target="_blank">
                  {t("partners.gmhsc.link")}
                </MuiLink>
              </Box>
              
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {t("partners.civicTech.title")}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t("partners.civicTech.description")}
                </Typography>
                <Typography variant="body1" paragraph fontWeight="medium">
                  {t("partners.civicTech.mission")}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t("partners.civicTech.milestone")}
                </Typography>
                <MuiLink href="https://civictechmoncton.org/" target="_blank">
                  {t("partners.civicTech.link")}
                </MuiLink>
              </Box>

              {/* <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {t("partners.venn.title")}
                </Typography>
                <Typography variant="body1">
                  {t("partners.venn.description")}
                </Typography>
              </Box> */}
            </Stack>
          </Box>

          <Divider />

          {/* Organizing Team */}
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {t("team.title")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("team.intro")}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {(t("team.core", { returnObjects: true }) as Array<{ name: string; role: string }>).map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider />

          {/* Accessibility */}
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {t("accessibility.title")}
            </Typography>
            <Typography variant="body1">
              {t("accessibility.description")}
            </Typography>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}
