import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { defaultNS } from "@app/i18n";
import { RoutingPath } from "@app/routing-paths";
import { PageContainer } from "./PageContainer";

const LogoutPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "logoutPage" });
  const { logOutCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const callLogOutCallback = async (): Promise<void> => {
      await logOutCallback();
      navigate(RoutingPath.LOGIN);
    };

    void callLogOutCallback();
  }, [logOutCallback, navigate]);

  return (
    <PageContainer center>
      <Typography>{t("processing")}</Typography>
    </PageContainer>
  );
};

export default LogoutPage;
