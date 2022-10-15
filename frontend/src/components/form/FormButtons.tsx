import { Button, Grid, Theme, useMediaQuery } from "@mui/material";
import { useFormState } from "react-hook-form";
import { FormPropType } from "./types/types";

interface ISubmitButtonProps {
  title: string;
  onClick: (data: FormPropType) => void;
}

export interface IButtonProps {
  title: string;
  onClick: () => void;
  showErrorColor?: boolean;
}

export interface IFormButtonsProps {
  submitButtonProps: ISubmitButtonProps | undefined;
  buttonsProps: IButtonProps[];
}

export const FormButtons = ({ submitButtonProps, buttonsProps }: IFormButtonsProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  /* 
    For the submit button disabling to work:
    - isDirty: default values must be set for all the inputs
    - isValid: useForm() mode has to be set to one of onChange, onTouched, and onBlur
  */
  const { isDirty, isValid } = useFormState();

  return (
    <Grid
      container
      direction={matchesDownSmBreakpoint ? "column" : "row"}
      justifyContent="center"
      alignSelf="center"
      gap={matchesDownSmBreakpoint ? "0.5rem" : "1.5rem"}
      sx={{ width: matchesDownSmBreakpoint ? "12rem" : "100%" }}
    >
      {submitButtonProps && (
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={!isDirty || !isValid}
        >
          {submitButtonProps.title}
        </Button>
      )}
      {buttonsProps.map((buttonProps, index) => (
        <Button
          key={index}
          variant="contained"
          color={buttonProps.showErrorColor ? "error" : undefined}
          onClick={buttonProps.onClick}
        >
          {buttonProps.title}
        </Button>
      ))}
    </Grid>
  );
};
