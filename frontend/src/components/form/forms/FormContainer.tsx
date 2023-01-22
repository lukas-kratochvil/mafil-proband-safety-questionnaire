import { Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { FormButtons, IFormButtonsProps } from "@components/form/components/FormButtons";
import { FormPropType } from "@interfaces/form";

interface IFormContainerProps {
  isError: boolean;
  buttons: IFormButtonsProps | undefined;
}

export const FormContainer = ({ children, isError, buttons }: PropsWithChildren<IFormContainerProps>) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = (data: FormPropType) => buttons?.submitButtonProps?.onClick(data);

  if (isError) {
    // TODO: create nice error content
    return <Typography variant="h1">Error occured!</Typography>;
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
