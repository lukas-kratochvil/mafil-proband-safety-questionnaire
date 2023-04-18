import { Stack, Theme, useMediaQuery } from "@mui/material";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { FormButtons, IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { ErrorAlert } from "@app/components/informative/ErrorAlert";
import { FormPropType } from "@app/model/form";
import { getValidatedFormData } from "../util/utils";
import { FormSkeleton } from "./FormSkeleton";

interface IFormContainerProps {
  isLoading: boolean;
  isError: boolean;
  buttons: IFormButtonsProps | undefined;
}

export const FormContainer = ({ children, isLoading, isError, buttons }: PropsWithChildren<IFormContainerProps>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = async (data: FormPropType) => {
    const validatedFormData = getValidatedFormData(data);
    await buttons?.submitButtonProps?.onClick(validatedFormData);
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
