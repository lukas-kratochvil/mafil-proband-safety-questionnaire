import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/hooks/auth/auth";

const NotFoundPage = () => {
  const { operator } = useAuth();
  const { t } = useTranslation("translation", { keyPrefix: "notFoundPage" });
  return operator === undefined ? null : <Typography fontSize="2rem">{t("text")}</Typography>;
};

export default NotFoundPage;
