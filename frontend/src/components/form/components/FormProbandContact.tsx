import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormTextField } from "../inputs/FormTextField";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContact = () => {
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
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
