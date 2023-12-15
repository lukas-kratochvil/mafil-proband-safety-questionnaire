import { Stack, Theme, useMediaQuery } from "@mui/material";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtons, IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { defaultNS } from "@app/i18n/i18n";
import { FormPropType } from "@app/model/form";
import { handleErrorsWithToast } from "@app/util/utils";
import { FormSkeleton } from "./FormSkeleton";

interface IFormContainerProps<TValidatedData> {
  isLoading: boolean;
  isError: boolean;
  buttons: IFormButtonsProps<TValidatedData> | undefined;
  getFormData: (data: FormPropType) => TValidatedData;
}

export const FormContainer = <TValidatedData,>({
  children,
  isLoading,
  isError,
  buttons,
  getFormData,
}: PropsWithChildren<IFormContainerProps<TValidatedData>>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation(defaultNS);
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
