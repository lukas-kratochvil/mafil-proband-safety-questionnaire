import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandContactAgreement = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandContactAgreement" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography>{t("text")}</Typography>
    </FormCardContainer>
  );
};
