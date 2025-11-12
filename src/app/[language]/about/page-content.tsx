"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "@/services/i18n/client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

export default function About() {
  const { t } = useTranslation("about");

  const team = t("team.members", { returnObjects: true }) as Record<string, string>;

  return (
    <Container maxWidth="md">
      <Stack my={16} spacing={6}>
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
            {t("title")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("description")}
            </Typography>
        </Box>

        <Box>
            <Typography variant="h5" paragraph>
            {t("event.title")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("event.date")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("event.location")}
            </Typography>
        </Box>

        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("team.title")}
            </Typography>

            <List>
            {Object.entries(team).map(([name, role]) => (
                <Box key={name}>
                <ListItem disablePadding>
                    <ListItemText
                    primary={
                        <Typography variant="body1" fontWeight="bold">
                        {name}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" color="text.secondary">
                        {role}
                        </Typography>
                    }
                    />
                </ListItem>
                <Divider />
                </Box>
            ))}
            </List>
        </Box>

        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
            {t("contact.title")}
            </Typography>

            <Typography variant="body1" paragraph>
            {t("contact.email")}
            </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
