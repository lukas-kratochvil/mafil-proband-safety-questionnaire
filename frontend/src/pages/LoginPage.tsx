import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CardContainer } from "../components/card/CardContainer";
import { useAuth } from "../hooks/auth/auth";
import { defaultNS } from "../i18n";
import { IAuthMethod } from "../interfaces/auth";
import { PageContainer } from "./PageContainer";

export const LoginPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "loginPage" });
  const { logIn } = useAuth();

  const handleLogIn = async (authMethod: IAuthMethod) => {
    if (!(await logIn(authMethod))) {
      // TODO: show some Alert that operator does not have access to the app authenticated version
      Error("Login was unsuccessful!");
    }
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
