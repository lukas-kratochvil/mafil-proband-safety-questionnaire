import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { defaultNS } from "@app/i18n/i18n";
import { RoutingPath } from "@app/routing-paths";
import { handleErrorsWithToast } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

const OidcAuthCallbackPage = () => {
  const { t } = useTranslation(defaultNS);
  const { logInCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const callLogInCallback = async (): Promise<void> => {
      try {
        navigate((await logInCallback()) ? RoutingPath.WAITING_ROOM : RoutingPath.LOGIN);
      } catch (error) {
        handleErrorsWithToast(error, t);
        navigate(RoutingPath.LOGIN);
      }
    };

    void callLogInCallback();
  }, [logInCallback, navigate, t]);

  return (
    <PageContainer center>
      <Typography>{t("oidcAuthCallbackPage.processing")}</Typography>
    </PageContainer>
  );
};

export default OidcAuthCallbackPage;
