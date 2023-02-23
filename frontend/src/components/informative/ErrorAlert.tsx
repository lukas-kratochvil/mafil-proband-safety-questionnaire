import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";

export const ErrorAlert = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "common" });

  return (
    <Alert
      severity="error"
      variant="outlined"
    >
      {t("errorAlert")}
    </Alert>
  );
};
