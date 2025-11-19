"use client";
import { motion } from "motion/react";
import { useTranslation } from "@/services/i18n/client";
import { getServerTranslation } from "@/services/i18n";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Home() {
    const { t } = useTranslation("home");
  
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
            
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            Hack4Change
            </motion.div>
  
            <Typography>
              <Trans
                i18nKey={`description`}
                t={t}
                components={[
                  <MuiLink
                    key="1"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/brocoders/extensive-react-boilerplate/blob/main/docs/README.md"
                  >
                    {}
                  </MuiLink>,
                ]}
              />
            </Typography>
          </Grid>
          <Grid sx={{ mx: "auto" }}>
            <MuiLink href="/privacy-policy">Privacy Policy</MuiLink>
          </Grid>
        </Grid>
      </Container>
    );
  }