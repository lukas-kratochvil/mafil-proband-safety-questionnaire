import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import { IAuthMethod, useAuth } from "../hooks/auth/Auth";
import { PageTemplate } from "./PageTemplate";

export const LoginPage = () => {
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleLogIn = async (authMethod: IAuthMethod) => {
    if (await logIn(authMethod)) {
      // TODO: redirect to an appropriate authentication page - move the redirection + authentication inside the logIn() method
      navigate("/auth/waiting-room");
    }
  };

  return (
    <PageTemplate centerize>
      <CardBox title="Bezpečnostní dotazník probanda">
        <Stack
          spacing="1rem"
          sx={{
            paddingY: "1.5rem",
            paddingX: "2rem",
          }}
        >
          <Typography>Přihlásit se přes:</Typography>
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
          </Stack>
        </Stack>
      </CardBox>
    </PageTemplate>
  );
};
