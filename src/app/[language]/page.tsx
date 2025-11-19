import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Trans } from "react-i18next/TransWithoutContext";
import HeroMotion from "@/components/hero-motion";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "home");

  return {
    title: t("title"),
  };
}

export default async function Home(props: Props) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "home");

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        pt={16}
        direction="column"
        sx={{ height: "90vh", justifyContent: "space-between" }}
      >
        <Grid size="grow">
          
        <HeroMotion subtitle={t("description")}>
          {t("title")}
        </HeroMotion>

        </Grid>
      </Grid>
    </Container>
  );
}
