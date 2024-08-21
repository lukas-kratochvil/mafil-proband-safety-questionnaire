import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/hooks/auth/auth";
import { RoutingPath } from "@app/routing-paths";
import { handleErrorsWithToast } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

/**
 * The OIDC provider redirects to this page after the user has attempted to log in.
 * We get the OIDC login result from the `logInCallback` hook and then redirect the user accordingly.
 */
const OidcAuthCallbackPage = () => {
  const { t } = useTranslation();
  const { logInCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const callLogInCallback = async (): Promise<void> => {
      try {
        navigate((await logInCallback()) ? RoutingPath.AUTH_HOME : RoutingPath.LOGIN, { replace: true });
      } catch (error) {
        handleErrorsWithToast(error, t);
        navigate(RoutingPath.LOGIN);
      }
    };

    void callLogInCallback();
  }, [logInCallback, navigate, t]);

  return (
    <PageContainer center>
      {/* TODO" create better waiting screen - some icon or gif or something */}
      <Typography>{t("oidcAuthCallbackPage.processing")}</Typography>
    </PageContainer>
  );
};

export default OidcAuthCallbackPage;
