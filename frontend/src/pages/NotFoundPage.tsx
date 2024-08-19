import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/hooks/auth/auth";
import { PageContainer } from "./PageContainer";

const NotFoundPage = () => {
  const { operator } = useAuth();
  const { t } = useTranslation("translation", { keyPrefix: "notFoundPage" });

  if (operator !== undefined) {
    return null;
  }

  return (
    <PageContainer center>
      <Typography fontSize="2rem">{t("text")}</Typography>
    </PageContainer>
  );
};

export default NotFoundPage;
