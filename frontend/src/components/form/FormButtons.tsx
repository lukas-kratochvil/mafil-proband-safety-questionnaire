import { Button, Grid, Theme, useMediaQuery } from "@mui/material";
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
        >
          {submitButtonProps.title}
        </Button>
      )}
      {buttonsProps.map((buttonProps) => (
        <Button
          key={buttonProps.title}
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
