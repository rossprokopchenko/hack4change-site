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
import { useTranslation } from "@/services/i18n/client";

type ForgotPasswordFormData = {
  email: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("forgot-password");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("forgot-password:inputs.email.validation.invalid"))
      .required(t("forgot-password:inputs.email.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("forgot-password");
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="send-email"
    >
      {t("forgot-password:actions.submit")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("forgot-password");
  const validationSchema = useValidationSchema();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Import resetPassword from Supabase auth
      const { resetPassword } = await import("@/services/supabase/auth");
      
      await resetPassword(formData.email);
      
      enqueueSnackbar(t("forgot-password:alerts.success"), {
        variant: "success",
      });
    } catch (err: any) {
      // Handle errors from Supabase
      const errorMessage = err.message || t("forgot-password:alerts.error");
      
      setError("email", {
        type: "manual",
        message: errorMessage,
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
                <Typography variant="h6">{t("forgot-password:title")}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextInput<ForgotPasswordFormData>
                  name="email"
                  label={t("forgot-password:inputs.email.label")}
                  type="email"
                  testId="email"
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

function ForgotPassword() {
  return <Form />;
}

export default withPageRequiredGuest(ForgotPassword);
