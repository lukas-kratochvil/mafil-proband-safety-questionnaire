import { Stack, Theme, useMediaQuery } from "@mui/material";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { FormButtons, IFormButtonsProps } from "@components/form/components/FormButtons";
import { ErrorAlert } from "@components/informative/ErrorAlert";
import { FormPropType } from "@interfaces/form";
import { FormSkeleton } from "./FormSkeleton";

interface IFormContainerProps {
  isLoading: boolean;
  isError: boolean;
  buttons: IFormButtonsProps | undefined;
}

export const FormContainer = ({ children, isLoading, isError, buttons }: PropsWithChildren<IFormContainerProps>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = (data: FormPropType) => buttons?.submitButtonProps?.onClick(data);

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
