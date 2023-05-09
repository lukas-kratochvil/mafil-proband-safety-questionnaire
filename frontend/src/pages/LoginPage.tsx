import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CardContainer } from "@app/components/card/CardContainer";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { defaultNS } from "@app/i18n";
import { PageContainer } from "./PageContainer";

const LoginPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "loginPage" });
  const { logIn } = useAuth();

  return (
    <PageContainer center>
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
              onClick={logIn}
              startIcon={
                <Avatar
                  variant="square"
                  alt="MUNI logo"
                  src="/logo_muni.svg"
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
          </Stack>
        </Stack>
      </CardContainer>
    </PageContainer>
  );
};

export default LoginPage;
