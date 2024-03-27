import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import { FormTextField } from "../inputs/FormTextField";
import { FormCardContainer } from "./FormCardContainer";
import type { IFormCardProps } from "./form-card";

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
          sm={1}
        >
          <FormTextField
            name="email"
            label={t("email")}
            disabled={disableInputs}
          />
        </Grid>
        <Grid
          item
          xs={2}
          sm={1}
        >
          <FormTextField
            name="phone"
            label={t("phone")}
            type="tel"
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
