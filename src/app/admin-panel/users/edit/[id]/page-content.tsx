"use client";

import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/hooks/use-snackbar";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import {
  useGetSupabaseUserService,
  usePatchSupabaseUserService,
  useRecoverSupabaseAccountService,
} from "@/services/supabase/users";
import { useParams } from "next/navigation";
import { RoleEnum } from "@/services/api/types/role";
import CircularProgress from "@mui/material/CircularProgress";

type EditUserFormData = {
  email: string;
  firstName: string;
  lastName: string;
  photo?: FileEntity;
  rsvpStatus?: string;
  teamName?: string;
};


const useValidationEditUserSchema = () => {
  const { t } = useTranslation("admin-panel-users-edit");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("admin-panel-users-edit:inputs.email.validation.invalid"))
      .required(
        t("admin-panel-users-edit:inputs.firstName.validation.required")
      ),
    firstName: yup
      .string()
      .required(
        t("admin-panel-users-edit:inputs.firstName.validation.required")
      ),
    lastName: yup
      .string()
      .required(
        t("admin-panel-users-edit:inputs.lastName.validation.required")
      ),
  });
};

function EditUserFormActions() {
  const { t } = useTranslation("admin-panel-users-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-users-edit:actions.submit")}
    </Button>
  );
}

function FormEditUser() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const fetchGetUser = useGetSupabaseUserService();
  const fetchPatchUser = usePatchSupabaseUserService();
  const recoverAccount = useRecoverSupabaseAccountService();
  const { t } = useTranslation("admin-panel-users-edit");
  const validationSchema = useValidationEditUserSchema();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<EditUserFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      photo: undefined,
      rsvpStatus: "",
      teamName: "",
    },
  });

  const { handleSubmit, setError, reset, getValues } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { status } = await fetchPatchUser({
      id: userId,
      data: formData,
    });

    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("admin-panel-users-edit:alerts.user.success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(t("admin-panel-users-edit:alerts.user.error"), {
        variant: "error",
      });
    }
  });

  const handleRecoverAccount = async () => {
    const email = getValues("email");
    const { status } = await recoverAccount(email);
    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar(t("admin-panel-users-edit:alerts.recover.success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(t("admin-panel-users-edit:alerts.recover.error"), {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      setIsLoading(true);
      const { status, data: user } = await fetchGetUser(userId);

      if (status === HTTP_CODES_ENUM.OK) {
        reset({
          email: user?.email ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          photo: user?.photo,
          rsvpStatus: user?.rsvpStatus ?? "",
          teamName: user?.teamName ?? "none",
        });
      }
      setIsLoading(false);
    };

    getInitialDataForEdit();
  }, [userId, reset, fetchGetUser]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">
                {t("admin-panel-users-edit:title1")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormAvatarInput<EditUserFormData> name="photo" testId="photo" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditUserFormData>
                name="email"
                testId="email"
                label={t("admin-panel-users-edit:inputs.email.label")}
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditUserFormData>
                name="firstName"
                testId="first-name"
                label={t("admin-panel-users-edit:inputs.firstName.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditUserFormData>
                name="lastName"
                testId="last-name"
                label={t("admin-panel-users-edit:inputs.lastName.label")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditUserFormData>
                name="rsvpStatus"
                testId="rsvp-status"
                label="RSVP Status"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditUserFormData>
                name="teamName"
                testId="team-name"
                label="Team"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <EditUserFormActions />
              <Button
                variant="outlined"
                color="warning"
                onClick={handleRecoverAccount}
              >
                {t("admin-panel-users-edit:actions.recover")}
              </Button>
              <Button
                variant="contained"
                color="inherit"
                LinkComponent={Link}
                href="/admin-panel/users"
              >
                {t("admin-panel-users-edit:actions.cancel")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditUser() {
  return (
    <Box sx={{ py: 4 }}>
      <FormEditUser />
    </Box>
  );
}

export default withPageRequiredAuth(EditUser);
