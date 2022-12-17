import { Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormPropType } from "@interfaces/form";
import { FormTextField } from "../inputs/FormTextField";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContactRequest = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContactRequest" });
  const { getValues } = useFormContext<FormPropType>();

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
          <Typography>
            {t("text", {
              name: getValues("name"),
              surname: getValues("surname"),
              birthdate: format(getValues("birthdate") as Date, "dd.MM.yyyy"),
              currentDate: format(new Date(), "dd.MM.yyyy"),
            })}
          </Typography>
        </Grid>
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
