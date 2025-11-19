"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Link from "@/components/link";
import Alert from "@mui/material/Alert";
import { signIn } from "@/services/supabase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";

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
    } catch (err: any) {
      // Handle specific Supabase auth errors
      let errorMessage = t("sign-in:errors.genericError");
      
      if (err.message) {
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 8, md: 12 },
        pb: 4,
      }}
    >
      <Container maxWidth="xs">
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {t("sign-in:title")}
            </Typography>
          </Grid>

          {registered && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="success">
                Account created successfully! Please check your email to verify your account, then sign in.
              </Alert>
            </Grid>
          )}

          {error && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{error}</Alert>
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
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
              data-testid="sign-in-submit"
            >
              {loading ? "Signing In..." : t("sign-in:actions.submit")}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Link href="/forgot-password">
                <MuiLink component="span" variant="body2" data-testid="forgot-password">
                  {t("sign-in:actions.forgotPassword")}
                </MuiLink>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                {t("sign-in:actions.noAccount")} {" "}
                <Link href="/sign-up">
                  <MuiLink component="span" data-testid="create-account">{t("sign-in:actions.createAccount")}</MuiLink>
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
