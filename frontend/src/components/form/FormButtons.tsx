import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { FormPropType } from "./types/types";

interface ISubmitButtonProps {
  title: string;
  onClick: (data: FormPropType) => void;
}

interface IButtonProps {
  title: string;
  onClick: () => void;
}

export interface IFormButtonsProps {
  submitButtonProps: ISubmitButtonProps;
  buttonsProps: IButtonProps[];
}

export const FormButtons = ({ submitButtonProps, buttonsProps }: IFormButtonsProps) => {
  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      direction={matchesDownSmBreakpoint ? "column" : "row"}
      justifyContent="center"
      alignSelf="center"
      gap={matchesDownSmBreakpoint ? "0.5rem" : "1.5rem"}
      sx={{ width: matchesDownSmBreakpoint ? "12rem" : "100%" }}
    >
      <Button
        type="submit"
        variant="contained"
        color="success"
        // TODO: doesn't work, why?? Should disable submit button when form isn't correctly filled
        // disabled={!isDirty || !isValid}
      >
        {submitButtonProps.title}
      </Button>
      {buttonsProps.map((buttonProps, index) => (
        <Button
          key={index}
          variant="contained"
          onClick={buttonProps.onClick}
        >
          {buttonProps.title}
        </Button>
      ))}
    </Grid>
  );
};
