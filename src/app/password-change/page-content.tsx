"use client";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useRouter } from "next/navigation";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";

type PasswordChangeFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("password-change");

  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("password-change:inputs.password.validation.min"))
      .required(t("password-change:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("password-change:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t("password-change:inputs.passwordConfirmation.validation.required")
      ),
  });
};

function FormActions() {
  const { t } = useTranslation("password-change");
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="set-password"
    >
      {t("password-change:actions.submit")}
    </Button>
  );
}


function PasswordChange() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("password-change");
  const validationSchema = useValidationSchema();
  const router = useRouter();

  const methods = useForm<PasswordChangeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { updatePassword } = await import("@/services/supabase/auth");
      const { supabase } = await import("@/lib/supabase/client");

      await updatePassword(formData.password);

      // Sign out to ensure the user has to login with their new password
      await supabase.auth.signOut();

      enqueueSnackbar(t("password-change:alerts.success"), {
        variant: "success",
      });

      router.replace("/sign-in");
    } catch (err) {
      console.error("Password reset error:", err);
      enqueueSnackbar(t("password-change:alerts.error"), {
        variant: "error",
      });
    }
  });

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 8, md: 12 } }}>
      <FormProvider {...methods}>
        <Container maxWidth="xs">
          <form onSubmit={onSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12 }} mt={3}>
                <Typography variant="h6">{t("password-change:title")}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextInput<PasswordChangeFormData>
                  name="password"
                  label={t("password-change:inputs.password.label")}
                  type="password"
                  testId="password"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextInput<PasswordChangeFormData>
                  name="passwordConfirmation"
                  label={t("password-change:inputs.passwordConfirmation.label")}
                  type="password"
                  testId="password-confirmation"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormActions />
              </Grid>
            </Grid>
          </form>
        </Container>
      </FormProvider>
    </Box>
  );
}

// Export directly without withPageRequiredGuest to allow access during recovery session
export default PasswordChange;
