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
import Image from "next/image";
import { useColorScheme } from "@mui/material/styles";

import { usePathname } from "next/navigation";
import useLanguage from "@/services/i18n/use-language";
import { languages } from "@/services/i18n/config";
import ThemeSwitchButton from "@/components/switch-theme-button";

export default function Footer() {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const language = useLanguage();
  const { mode: colorScheme } = useColorScheme();

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
          <Box sx={{ 
            textAlign: { xs: "center", md: "left" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0
          }}>
            <Box sx={{ }}>
              <Image
                src="/Logos/Hack4Change Logo SVG/Primary Small Logo/Final Logo Moncton_Primary Small Logo_Blue.svg"
                alt="Hack4Change"
                width={120}
                height={50}
                className="logo-light"
                style={{ width: "auto", height: "50px" }}
              />
              <Image
                src="/Logos/Hack4Change Logo SVG/Primary Small Logo/Final Logo Moncton_Primary Small Logo_Dark Pink-17.svg"
                alt="Hack4Change"
                width={120}
                height={50}
                className="logo-dark"
                style={{ width: "auto", height: "50px" }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1}}>
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
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
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
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
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

          {/* Theme Switcher */}
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("common:theme.title")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
              <ThemeSwitchButton />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
