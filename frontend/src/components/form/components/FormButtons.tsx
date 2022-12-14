import { Button, Grid, Theme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { convertStringToLocalizationKey, IButton, ISubmitButtonProps } from "@util/utils";

export interface IButtonProps extends IButton {
  showErrorColor?: boolean;
}

export interface IFormButtonsProps {
  submitButtonProps: ISubmitButtonProps | undefined;
  buttonsProps: IButtonProps[];
}

export const FormButtons = ({ submitButtonProps, buttonsProps }: IFormButtonsProps) => {
  const { t } = useTranslation(defaultNS);
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
          {t(convertStringToLocalizationKey(submitButtonProps.titleLocalizationKey))}
        </Button>
      )}
      {buttonsProps.map((buttonProps) => (
        <Button
          key={buttonProps.titleLocalizationKey}
          variant="contained"
          color={buttonProps.showErrorColor ? "error" : undefined}
          onClick={buttonProps.onClick}
        >
          {t(convertStringToLocalizationKey(buttonProps.titleLocalizationKey))}
        </Button>
      ))}
    </Grid>
  );
};
