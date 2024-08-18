import { Stack, useMediaQuery, type Theme } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtons, type FormButtonsProps } from "@app/components/form/components/FormButtons";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import type { FormPropType } from "@app/model/form";
import { handleErrorsWithToast } from "@app/util/utils";
import { FormSkeleton } from "./FormSkeleton";

type FormContainerProps<TValidatedData extends object> = {
  isLoading: boolean;
  isError: boolean;
  buttons: FormButtonsProps<TValidatedData> | undefined;
  getFormData: (data: FormPropType) => TValidatedData;
};

export const FormContainer = <TValidatedData extends object>({
  children,
  isLoading,
  isError,
  buttons,
  getFormData,
}: PropsWithChildren<FormContainerProps<TValidatedData>>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = async (data: FormPropType) => {
    const validatedFormData = getFormData(data);

    try {
      await buttons?.submitButtonProps?.onClick(validatedFormData);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }
  };

  if (isError) {
    return <ErrorAlert />;
  }

  if (isLoading) {
    return <FormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      aria-label="Visit form"
    >
      <Stack
        spacing={matchesDownSmBreakpoint ? "1rem" : "1.5rem"}
        alignItems="stretch"
      >
        {children}
        {buttons !== undefined && <FormButtons {...buttons} />}
      </Stack>
    </form>
  );
};
