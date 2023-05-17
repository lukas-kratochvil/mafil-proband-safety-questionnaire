import { Avatar, Button, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CardContainer } from "@app/components/card/CardContainer";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { defaultNS } from "@app/i18n";
import { PageContainer } from "./PageContainer";

const LoginPage = () => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation(defaultNS, { keyPrefix: "loginPage" });
  const { logIn } = useAuth();

  return (
    <PageContainer center>
      <CardContainer
        title={t("title")}
        maxWidth="25rem"
      >
        <Stack
          spacing="1rem"
          sx={{
            paddingY: "1.5rem",
            paddingX: "2rem",
          }}
        >
          <Typography>{t("loginText")}</Typography>
          <Stack
            spacing="0.5rem"
            sx={{ paddingX: matchesDownSmBreakpoint ? "1.5rem" : "2.75rem" }}
          >
            <Button
              variant="outlined"
              onClick={logIn}
              startIcon={
                <Avatar
                  variant="rounded"
                  alt="MUNI logo"
                  src="/logo_muni.svg"
                  sx={{
                    marginRight: "1rem",
                    width: "auto",
                    height: "2rem",
                  }}
                />
              }
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                textTransform: "none",
                color: "unset",
                fontWeight: "unset",
                lineHeight: "1rem",
              }}
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
