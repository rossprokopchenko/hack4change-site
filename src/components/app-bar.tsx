"use client";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import Link from "@/components/link";
import { RoleEnum } from "@/services/api/types/role";
import Divider from "@mui/material/Divider";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useColorScheme, useTheme } from "@mui/material/styles";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import useLanguage from "@/services/i18n/use-language";
import useStoreLanguageActions from "@/services/i18n/use-store-language-actions";
import { languages } from "@/services/i18n/config";
import MuiLink from "@mui/material/Link";

function ResponsiveAppBar() {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { mode } = useColorScheme();
  const theme = useTheme();
  const pathname = usePathname();
  const language = useLanguage();
  const { setLanguage } = useStoreLanguageActions();
  const [anchorElementNav, setAnchorElementNav] = useState<null | HTMLElement>(
    null
  );
  const [anchorElementUser, setAnchorElementUser] =
    useState<null | HTMLElement>(null);

  // Handle language switch - update cookie and refresh page to apply new language
  const handleLanguageSwitch = (lang: string) => {
    setLanguage(lang); // Save to cookie
    window.location.reload(); // Refresh to apply new language from server
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElementNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElementUser(null);
  };

  // Determine which logo to use based on theme
  const logoSrc = mode === "light" 
    ? "/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Light Black.svg"
    : "/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Dark White-20.svg";

  return (
    <AppBar position="static" color="primary" sx={{ height: "64px", position: "relative", overflow: "hidden" }}>
      {/* Left Decoration */}
      {/* <Box
        component="img"
        src={mode === "light" 
          ? "/Backgrounds/1x2/Photo_Overlay_1x2-08-2.png"
          : "/Backgrounds/1x2/Photo_Overlay_1x2-98-2.png"}
        alt=""
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "auto",
          maxWidth: "20%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
          opacity: 0.8
        }}
      /> */}
      
      {/* Right Decoration */}
      {/* <Box
        component="img"
        src={mode === "light" 
          ? "/Backgrounds/1x2/Photo_Overlay_1x2-22-2.png"
          : "/Backgrounds/1x2/Photo_Overlay_1x2-99-2.png"}
        alt=""
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "auto",
          maxWidth: "20%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
          opacity: 0.8
        }}
      /> */}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, px: {xs: 2, md: 16} }}>
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Image
              src="/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Light Black.svg"
              alt="Hack4Change"
              width={120}
              height={60}
              className="logo-light"
              style={{ objectFit: "contain" }}
              priority
            />
            <Image
              src="/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Dark White-20.svg"
              alt="Hack4Change"
              width={120}
              height={60}
              className="logo-dark"
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElementNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElementNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* <MenuItem onClick={handleCloseNavMenu} component={Link} href="/">
                <Typography textAlign="center">
                  {t("common:navigation.home")}
                </Typography>
              </MenuItem> */}

              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/about">
                <Typography textAlign="center">
                  {t("common:navigation.about")}
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/faq">
                <Typography textAlign="center">
                  {t("common:navigation.faq")}
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/sponsors">
                <Typography textAlign="center">
                  {t("common:navigation.sponsors")}
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/contact">
                <Typography textAlign="center">
                  {t("common:navigation.contact")}
                </Typography>
              </MenuItem>

              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="users"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/users"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.users")}
                    </Typography>
                  </MenuItem>,
                  // mobile-menu-items
                ]}
              {/*{isLoaded &&
                !user &&
                  <MenuItem
                    key="sign-in"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/sign-in"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.signIn")}
                    </Typography>
                  </MenuItem>
                  */}
            </Menu>
          </Box>
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Image
              src="/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Light Black.svg"
              alt="Hack4Change"
              width={140}
              height={50}
              className="logo-light"
              style={{ objectFit: "contain" }}
              priority
            />
            <Image
              src="/Logos/Hack4Change Logo SVG/H4C Logo/Final Logo Moncton_H4C Logo_Dark White-20.svg"
              alt="Hack4Change"
              width={140}
              height={50}
              className="logo-dark"
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0 }}>
            {/* <Button
              onClick={handleCloseNavMenu}
              sx={{ color: "primary.contrastText", px: 2, py: 2 }}
              component={Link}
              href="/"
            >
              {t("common:navigation.home")}
            </Button> */}

            <Button
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "primary.contrastText", 
                px: 2, 
                py: 1.5,
                my: 0.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }
              }}
              component={Link}
              href="/about"
            >
              {t("common:navigation.about")}
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "primary.contrastText", 
                px: 2, 
                py: 1.5,
                my: 0.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }
              }}
              component={Link}
              href="/sponsors"
            >
              {t("common:navigation.sponsors")}
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "primary.contrastText", 
                px: 2, 
                py: 1.5,
                my: 0.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }
              }}
              component={Link}
              href="/contact"
            >
              {t("common:navigation.contact")}
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "primary.contrastText", 
                px: 2, 
                py: 1.5,
                my: 0.5,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }
              }}
              component={Link}
              href="/faq"
            >
              {t("common:navigation.faq")}
            </Button>

            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 2, bgcolor: "primary.contrastText" }} />
                  <Box>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ 
                        color: "primary.contrastText", 
                        px: 2, 
                        py: 1.5,
                        my: 0.5,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        }
                      }}
                      component={Link}
                      href="/admin-panel/users"
                    >
                      {t("common:navigation.users")}
                    </Button>
                  </Box>
                </>
              )}
          </Box>

          {!isLoaded ? (
            <CircularProgress color="inherit" />
          ) : user ? (
            <>
              <Box sx={{ flexGrow: 0, display: "flex", gap: 2, alignItems: "center" }}>
                {/* Language Switcher for logged-in users */}
                <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                  {languages.map((lang, index) => (
                    <Box key={lang} sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="button"
                        onClick={() => handleLanguageSwitch(lang)}
                        sx={{
                          background: "none",
                          border: "none",
                          fontWeight: language === lang ? 700 : 400,
                          color: language === lang ? "primary.contrastText" : "rgba(255, 255, 255, 0.7)",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontFamily: "inherit",
                          padding: 0,
                          "&:hover": {
                            color: "primary.contrastText",
                          },
                        }}
                      >
                        {lang.toUpperCase()}
                      </Box>
                      {index < languages.length - 1 && (
                        <Divider orientation="vertical" flexItem sx={{ mx: 1.5, bgcolor: "rgba(255, 255, 255, 0.3)", height: "16px", alignSelf: "center" }} />
                      )}
                    </Box>
                  ))}
                </Box>

                <Tooltip title="Profile">
                  <IconButton
                    component={Link}
                    href="/profile"
                    sx={{ p: 0, color: "primary.light" }}
                    data-testid="profile-menu-item"
                  >
                    <Avatar
                      alt={user?.firstName + " " + user?.lastName}
                      src={user.photo?.path}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout" sx={{ ml: 2 }}>
                  <IconButton
                    onClick={logOut}
                    sx={{ color: "primary.contrastText" }}
                    data-testid="logout-menu-item"
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {/* Language Switcher */}
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                {languages.map((lang, index) => (
                  <Box key={lang} sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="button"
                      onClick={() => handleLanguageSwitch(lang)}
                      sx={{
                        background: "none",
                        border: "none",
                        fontWeight: language === lang ? 700 : 400,
                        color: language === lang ? "primary.contrastText" : "rgba(255, 255, 255, 0.7)",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        padding: 0,
                        "&:hover": {
                          color: "primary.contrastText",
                        },
                      }}
                    >
                      {lang.toUpperCase()}
                    </Box>
                    {index < languages.length - 1 && (
                      <Divider orientation="vertical" flexItem sx={{ mx: 1.5, bgcolor: "rgba(255, 255, 255, 0.3)", height: "16px", alignSelf: "center" }} />
                    )}
                  </Box>
                ))}
              </Box>

              {/* Sign In Button */}
              {!pathname?.includes("/sign-in") && (
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    color: "primary.contrastText", 
                    px: 2, 
                    py: 1.5,
                    my: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    }
                  }}
                  component={Link}
                  href="/sign-in"
                >
                  {t("common:navigation.signIn")}
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
