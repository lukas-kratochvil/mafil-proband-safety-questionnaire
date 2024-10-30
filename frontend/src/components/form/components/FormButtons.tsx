import { Button, Grid, useMediaQuery, type Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import type { StrictOmit } from "@app/types";
import { handleErrorsWithToast, type ButtonProps } from "@app/util/utils";

export type FormButtonsProps = {
  submitButtonProps: StrictOmit<ButtonProps, "onClick" | "urlPath"> | undefined;
  buttonsProps: ButtonProps[];
};

export const FormButtons = ({ submitButtonProps, buttonsProps }: FormButtonsProps) => {
  const { t } = useTranslation();
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
          {...(buttonProps.onClick
            ? {
                onClick: async () => {
                  try {
                    await buttonProps.onClick();
                  } catch (error) {
                    handleErrorsWithToast(error, t);
                  }
                },
              }
            : { component: Link, to: buttonProps.urlPath })}
        >
          {t(convertStringToLocalizationKey(buttonProps.titleLocalizationKey))}
        </Button>
      ))}
    </Grid>
  );
};
