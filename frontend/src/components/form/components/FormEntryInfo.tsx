import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormEntryInfo = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.entryInfo" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography>{t("text1")}</Typography>
      <Typography marginTop="1rem">{t("text2")}</Typography>
    </FormCardContainer>
  );
};
