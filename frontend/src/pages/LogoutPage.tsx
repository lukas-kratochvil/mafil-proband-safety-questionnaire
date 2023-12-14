import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n/i18n";
import { RoutingPath } from "@app/routing-paths";
import { PageContainer } from "./PageContainer";

// Jednotné přihlášení MUNI uses logout redirect in the case when user wants to stay logged in (user didn't logged out)
const LogoutPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "logoutPage" });
  const navigate = useNavigate();

  useEffect(() => navigate(RoutingPath.WAITING_ROOM), [navigate]);

  return (
    <PageContainer center>
      <Typography>{t("processing")}</Typography>
    </PageContainer>
  );
};

export default LogoutPage;
