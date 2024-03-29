import { Button, Grid, Theme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n";
import { handleErrorsWithToast, IButtonProps } from "@app/util/utils";
import { IFormSubmitButtonProps } from "../util/utils";

export interface IFormButtonsProps {
  submitButtonProps: IFormSubmitButtonProps | undefined;
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
          color={submitButtonProps.showErrorColor ? "error" : "success"}
        >
          {t(convertStringToLocalizationKey(submitButtonProps.titleLocalizationKey))}
        </Button>
      )}
      {buttonsProps.map((buttonProps) => (
        <Button
          key={buttonProps.titleLocalizationKey}
          variant="contained"
          color={buttonProps.showErrorColor ? "error" : undefined}
          onClick={async () => {
            try {
              await buttonProps.onClick();
            } catch (error) {
              handleErrorsWithToast(error, t);
            }
          }}
        >
          {t(convertStringToLocalizationKey(buttonProps.titleLocalizationKey))}
        </Button>
      ))}
    </Grid>
  );
};
