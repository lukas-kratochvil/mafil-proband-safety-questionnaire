import { Alert, Avatar, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CardContainer } from "@components/card/CardContainer";
import { useAuth } from "@hooks/auth/auth";
import { defaultNS } from "@i18n";
import { IAuthMethod } from "@interfaces/auth";
import { PageContainer } from "./PageContainer";

const LoginPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "loginPage" });
  const { logIn } = useAuth();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState<boolean>(true);

  const handleLogIn = async (authMethod: IAuthMethod) => {
    setIsLoginSuccessful(await logIn(authMethod));
  };

  return (
    <PageContainer centerize>
      <CardContainer title={t("title")}>
        <Stack
          spacing="1rem"
          sx={{
            paddingY: "1.5rem",
            paddingX: "2rem",
          }}
        >
          {!isLoginSuccessful && (
            <Alert
              severity="error"
              variant="outlined"
            >
              {t("alert")}
            </Alert>
          )}
          <Typography>{t("loginText")}</Typography>
          <Stack spacing="0.5rem">
            <Button
              variant="outlined"
              onClick={async () => {
                await handleLogIn(IAuthMethod.MUNI);
              }}
              startIcon={
                <Avatar
                  variant="square"
                  alt="MUNI logo"
                  src="/logo_muni.png"
                  sx={{
                    marginRight: "0.5rem",
                    width: "2rem",
                    height: "2rem",
                  }}
                />
              }
            >
              MUNI
            </Button>
            {/* TODO: delete this button under called 'MUNI - s vyšším oprávněním' - only for test purposes */}
            <Button
              variant="outlined"
              onClick={async () => {
                await handleLogIn(IAuthMethod.MUNI_HIGHER_PERMISSION);
              }}
              startIcon={
                <Avatar
                  variant="square"
                  alt="MUNI logo"
                  src="/logo_muni.png"
                  sx={{
                    marginRight: "0.5rem",
                    width: "2rem",
                    height: "2rem",
                  }}
                />
              }
            >
              MUNI - s vyšším oprávněním
            </Button>
          </Stack>
        </Stack>
      </CardContainer>
    </PageContainer>
  );
};

export default LoginPage;
