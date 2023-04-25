import { Stack, Theme, useMediaQuery } from "@mui/material";
import { AxiosError } from "axios";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FormButtons, IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { defaultNS } from "@app/i18n";
import { FormPropType } from "@app/model/form";
import { ServerApiValidationError } from "@app/util/server_API/error-handling";
import { getValidatedFormData } from "../util/utils";
import { FormSkeleton } from "./FormSkeleton";

interface IFormContainerProps {
  isLoading: boolean;
  isError: boolean;
  buttons: IFormButtonsProps | undefined;
}

export const FormContainer = ({ children, isLoading, isError, buttons }: PropsWithChildren<IFormContainerProps>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation(defaultNS);
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = async (data: FormPropType) => {
    const validatedFormData = getValidatedFormData(data);

    try {
      await buttons?.submitButtonProps?.onClick(validatedFormData);
    } catch (e) {
      if (e instanceof ServerApiValidationError) {
        toast.error(`${t("common.errors.serverValidationError")}:\n${e.message}`);
      } else if (e instanceof AxiosError) {
        toast.error(t("common.errors.serverCommunicationError"));
      } else {
        toast.error(t("common.errors.contactAdmin"));
      }
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
