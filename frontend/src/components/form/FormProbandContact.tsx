import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "../../i18n";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCardContainer } from "./FormCardContainer";
import { FormTextField } from "./inputs/FormTextField";
import { IFormInputsProps } from "./types/types";

export const FormProbandContact = ({ disableInputs }: IFormInputsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContact" });

  return (
    <FormCardContainer title={t("title")}>
      <Grid
        container
        direction="row"
        spacing="1rem"
        columns={2}
      >
        <Grid
          item
          xs={2}
        >
          <Typography>{t("text")}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sm={1}
        >
          <FormTextField
            name="email"
            label={t("email")}
            isOptional
            disabled={disableInputs}
          />
          <ErrorFeedback name="email" />
        </Grid>
        <Grid
          item
          xs={2}
          sm={1}
        >
          <FormTextField
            name="phoneNumber"
            label={t("phone")}
            type="tel"
            isOptional
            disabled={disableInputs}
          />
          <ErrorFeedback name="phoneNumber" />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
