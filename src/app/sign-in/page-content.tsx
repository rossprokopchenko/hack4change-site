"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import SvgIcon from "@mui/material/SvgIcon";
import Link from "@/components/link";
import Alert from "@mui/material/Alert";
import { signIn, signInWithOAuth } from "@/services/supabase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";

// Google Icon
const GoogleIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </SvgIcon>
);

// GitHub Icon
const GitHubIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.84 0 4.32-2.58 5.23-5.04 5.5.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
    />
  </SvgIcon>
);

export default function SignInSupabase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation("sign-in");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      });

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      // Handle specific Supabase auth errors
      let errorMessage = t("sign-in:errors.genericError");
      
      if (err instanceof Error && err.message) {
        // Supabase returns specific error messages we can check
        if (err.message.includes("Invalid login credentials") || 
            err.message.includes("invalid") ||
            err.message.includes("Invalid")) {
          errorMessage = t("sign-in:errors.invalidCredentials");
        } else if (err.message.includes("User not found") || 
                   err.message.includes("not found")) {
          errorMessage = t("sign-in:errors.accountNotFound");
        } else if (err.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before signing in. Check your inbox for the verification link.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError("");
    setOauthLoading(provider);

    try {
      await signInWithOAuth(provider);
      // The user will be redirected to the OAuth provider
    } catch (err) {
      setError(t("sign-in:errors.genericError"));
      setOauthLoading(null);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 8, md: 16 },
        pb: { xs: 8, md: 16 },
      }}
    >
      <Container maxWidth="xs">
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{color: "text.primary"}}>
              {t("sign-in:title")}
            </Typography>
          </Grid>

          {registered && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="success" sx={{color: "success.main"}}>
                Account created successfully! Please check your email to verify your account, then sign in.
              </Alert>
            </Grid>
          )}

          {error && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error" sx={{color: "error.main"}}>{error}</Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              type="email"
              label={t("sign-in:inputs.email.label")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              autoFocus
              data-testid="email"
              sx={{borderColor: "secondary.main", color: "secondary.main"}}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              type="password"
              label={t("sign-in:inputs.password.label")}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              data-testid="password"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{bgcolor: "primary.main"}}
              fullWidth
              disabled={loading}
              size="large"
              data-testid="sign-in-submit"
            >
              {loading ? "Signing In..." : t("sign-in:actions.submit")}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", mt: 1}}>
              <Link href="/forgot-password">
                <MuiLink component="span" variant="body2" data-testid="forgot-password" sx={{color: "primary.main", fontWeight: "bold"}}>
                  {t("sign-in:actions.forgotPassword")}
                </MuiLink>
              </Link>
            </Box>
          </Grid>

          {/* OAuth Divider */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("sign-in:or")}
              </Typography>
            </Divider>
          </Grid>

          {/* OAuth Buttons */}
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={() => handleOAuthSignIn('google')}
              disabled={oauthLoading !== null}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              data-testid="google-sign-in"
            >
              {oauthLoading === 'google' ? 'Signing In...' : t("sign-in:oauth.google")}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              onClick={() => handleOAuthSignIn('github')}
              disabled={oauthLoading !== null}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              data-testid="github-sign-in"
            >
              {oauthLoading === 'github' ? 'Signing In...' : t("sign-in:oauth.github")}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", mt: 1}}>
              <Typography variant="body2" sx={{color: "text.primary"}}>
                {t("sign-in:actions.noAccount")} {" "}
                <Link href="/sign-up">
                  <MuiLink component="span" data-testid="create-account" sx={{color: "primary.main", fontWeight: "bold"}}>{t("sign-in:actions.createAccount")}</MuiLink>
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
    </Box>
  );
}
