import { useAuth } from "@app/hooks/auth/auth";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { operator } = useAuth();
  const { t } = useTranslation("translation", { keyPrefix: "notFoundPage" });
  return operator === undefined ? null : <Typography fontSize="2rem">{t("text")}</Typography>;
};

export default NotFoundPage;
