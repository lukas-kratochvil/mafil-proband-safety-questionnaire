import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "../../i18n";
import { FormCardContainer } from "./FormCardContainer";

export const FormSafetyInfo = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.safetyInfo" });

  return (
    <FormCardContainer title={t("title")}>
      <Typography>{t("text")}</Typography>
    </FormCardContainer>
  );
};
