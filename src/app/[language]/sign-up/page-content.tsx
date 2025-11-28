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
import { signUp } from "@/services/supabase/auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";

export default function SignUpSupabase() {
  const router = useRouter();
  const { t } = useTranslation("sign-up");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!agreedToPolicy) {
      setError("You must agree to the privacy policy");
      setLoading(false);
      return;
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      // Redirect to sign-in page with success message
      router.push("/sign-in?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up");
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
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              {t("sign-up:title")}
            </Typography>
          </Grid>

          {error && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label={t("sign-up:inputs.firstName.label")}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              autoFocus
              data-testid="first-name"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label={t("sign-up:inputs.lastName.label")}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              data-testid="last-name"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              type="email"
              label={t("sign-up:inputs.email.label")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              data-testid="email"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              type="password"
              label={t("sign-up:inputs.password.label")}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              helperText="Minimum 6 characters"
              data-testid="password"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} data-testid="privacy-policy">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                required
              />
              <Typography variant="body2">
                I agree to the{" "}
                <MuiLink href="/privacy-policy" target="_blank">
                  Privacy Policy
                </MuiLink>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
              data-testid="sign-up-submit"
            >
              {loading ? "Creating Account..." : t("sign-up:actions.submit")}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link href="/sign-in">
                  <MuiLink component="span">Sign In</MuiLink>
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
