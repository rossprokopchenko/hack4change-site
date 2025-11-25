"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import NextLink from "next/link";

import { usePathname } from "next/navigation";
import useLanguage from "@/services/i18n/use-language";
import { languages } from "@/services/i18n/config";

export default function Footer() {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const language = useLanguage();

  const getLanguageLink = (lang: string) => {
    if (!pathname) return `/${lang}`;
    const segments = pathname.split("/");
    segments[1] = lang;
    return segments.join("/");
  };

  return (
    <Box
      component="footer"
      sx={[
        (theme) => ({
          py: 12,
          px: 2,
          mt: "auto",
          backgroundColor: theme.vars!.palette.grey[200],
          borderTop: `1px solid ${theme.vars!.palette.divider}`,
        }),
        (theme) =>
          theme.applyStyles("dark", {
            backgroundColor: theme.vars!.palette.grey[900],
          }),
      ]}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 4,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                mb: 1,
              }}
            >
              {t("common:app-name")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {t("common:legal.rights")}
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 16 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {t("common:navigation.title")}
              </Typography>
              <MuiLink component={Link} href="/" underline="hover" color="text.secondary">
                {t("common:navigation.home")}
              </MuiLink>
              <MuiLink component={Link} href="/about" underline="hover" color="text.secondary">
                {t("common:navigation.about")}
              </MuiLink>
              <MuiLink component={Link} href="/faq" underline="hover" color="text.secondary">
                {t("common:navigation.faq")}
              </MuiLink>
              <MuiLink component={Link} href="/sponsors" underline="hover" color="text.secondary">
                {t("common:navigation.sponsors")}
              </MuiLink>
              <MuiLink component={Link} href="/contact" underline="hover" color="text.secondary">
                {t("common:navigation.contact")}
              </MuiLink>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {t("common:legal.title")}
              </Typography>
              <MuiLink
                component={Link}
                href="/privacy-policy"
                underline="hover"
                color="text.secondary"
              >
                {t("common:legal.privacyPolicy")}
              </MuiLink>
              <MuiLink
                component={Link}
                href="/code-of-conduct"
                underline="hover"
                color="text.secondary"
              >
                {t("common:legal.codeOfConduct")}
              </MuiLink>
            </Box>
          </Box>

          {/* Social Media Icons (todo: add) & Language */}
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            {/* <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t("common:socialMedia.title")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "center", md: "flex-end" }, mb: 3 }}>
              <IconButton
                aria-label="LinkedIn"
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Box> */}

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t("common:language.title")}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-end" } }}>
              {languages.map((lang) => (
                <MuiLink
                  key={lang}
                  component={NextLink}
                  href={getLanguageLink(lang)}
                  underline="none"
                  sx={{
                    fontWeight: language === lang ? 700 : 400,
                    color: language === lang ? "primary.main" : "text.secondary",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {lang.toUpperCase()}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
