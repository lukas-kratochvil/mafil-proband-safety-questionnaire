import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormExaminationConsent = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.examinationConsent" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography>{t("text1")}</Typography>
      <Typography marginTop="1rem">{t("text2")}</Typography>
      <Typography marginTop="1rem">{t("contactInfo")}:</Typography>
      <Typography width="100%">{t("address")}</Typography>
      <Typography width="100%">{t("contactPerson")}: Michal Mikl</Typography>
      <Typography width="100%">{t("phone")}: + 420 54949 6099</Typography>
      <Typography width="100%">{t("email")}: mafil@ceitec.muni.cz</Typography>
    </FormCardContainer>
  );
};
