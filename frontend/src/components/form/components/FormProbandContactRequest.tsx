import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SanitizedHtml } from "@app/components/SanitizedHtml";
import type { LanguageCode } from "@app/i18n/i18n";
import type { FormPropType } from "@app/model/form";
import { fetchProbandContactRequest } from "@app/util/server_API/calls";
import { FormTextField } from "../inputs/FormTextField";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContactRequest = () => {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "form.probandContactRequest" });
  const { getValues } = useFormContext<FormPropType>();

  const name = getValues("name");
  const surname = getValues("surname");
  const birthdateStr = format(getValues("birthdate") as Date, "d.M.y");
  const currentDateStr = format(new Date(), "d.M.y");

  const { data } = useQuery({
    queryKey: ["probandContactRequest", i18n.language, name, surname, birthdateStr, currentDateStr],
    queryFn: () =>
      fetchProbandContactRequest(i18n.language as LanguageCode, name, surname, birthdateStr, currentDateStr),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <FormCardContainer title={data.title}>
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
          <SanitizedHtml html={data.html} />
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
            name="phone"
            label={t("phone")}
            type="tel"
          />
        </Grid>
        <Grid
          item
          xs={2}
        >
          <Typography>{t("emailNote")}</Typography>
          <Typography>{t("phoneNote")}</Typography>
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
