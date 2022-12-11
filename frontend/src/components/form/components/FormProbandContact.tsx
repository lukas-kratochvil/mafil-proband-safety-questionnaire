import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormTextField } from "../inputs/FormTextField";
import { IFormCardProps } from "../interfaces/form-card";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContact = ({ disableInputs }: IFormCardProps) => {
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
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};