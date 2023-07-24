import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { defaultNS } from "@app/i18n";
import { RoutingPath } from "@app/routing-paths";
import { PageContainer } from "./PageContainer";

const OidcAuthCallbackPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "oidcAuthCallbackPage" });
  const { logInCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const callLogInCallback = async (): Promise<void> =>
      navigate((await logInCallback()) ? RoutingPath.WAITING_ROOM : RoutingPath.LOGIN);

    void callLogInCallback();
  }, [logInCallback, navigate]);

  return (
    <PageContainer center>
      <Typography>{t("processing")}</Typography>
    </PageContainer>
  );
};

export default OidcAuthCallbackPage;
