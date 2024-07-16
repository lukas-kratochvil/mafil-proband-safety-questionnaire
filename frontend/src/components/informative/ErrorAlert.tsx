import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ErrorAlert = () => {
  const { t } = useTranslation("translation", { keyPrefix: "common.errors" });

  return (
    <Alert
      severity="error"
      variant="outlined"
    >
      {t("contactAdmin")}
    </Alert>
  );
};
