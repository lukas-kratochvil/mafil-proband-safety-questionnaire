import { Stack, useMediaQuery, type Theme } from "@mui/material";
import { useState, type PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtons, type FormButtonsProps } from "@app/components/form/components/FormButtons";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import type { FormPropType } from "@app/model/form";
import { LoadingOverlay } from "@app/overlays/LoadingOverlay";
import { handleErrorsWithToast, type ButtonProps } from "@app/util/utils";
import { FormSkeleton } from "./FormSkeleton";

type FormSubmitButtonProps<TValidatedData extends object> = FormButtonsProps["submitButtonProps"] & {
  onClick: (data: TValidatedData) => Promise<void>;
};

export type FormContainerButtonsProps<TValidatedData extends object> = {
  submitButtonProps: FormSubmitButtonProps<TValidatedData> | undefined;
  buttonsProps: ButtonProps[];
};

type FormContainerProps<TValidatedData extends object> = {
  isLoading: boolean;
  isError: boolean;
  buttons: FormContainerButtonsProps<TValidatedData> | undefined;
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

  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const onValid = async (data: FormPropType) => {
    setShowLoadingScreen(true);
    const validatedFormData = getFormData(data);

    try {
      await buttons?.submitButtonProps?.onClick(validatedFormData);
    } catch (error) {
      handleErrorsWithToast(error, t);
    } finally {
      setShowLoadingScreen(false);
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
        {buttons && (
          <FormButtons
            {...buttons}
            setShowLoadingScreen={setShowLoadingScreen}
          />
        )}
      </Stack>
      <LoadingOverlay isOpen={showLoadingScreen} />
    </form>
  );
};
