import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import { IAuthMethod, useAuth } from "../hooks/auth/Auth";
import { PageTemplate } from "./PageTemplate";

export const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (authMethod: IAuthMethod) => {
    signIn(authMethod);
    navigate("/auth/waiting-room"); // TODO: redirect to an appropriate authentication page
  };

  return (
    <PageTemplate centerize>
      <CardBox
        title="Bezpečnostní dotazník probanda"
        width="30rem"
      >
        <Typography
          sx={{
            paddingTop: "1.5rem",
            paddingLeft: "3rem",
          }}
        >
          Přihlásit se přes:
        </Typography>
        <Stack
          spacing={1}
          paddingTop="1rem"
          paddingBottom="2rem"
          paddingX="8rem"
        >
          <Button
            variant="outlined"
            onClick={() => handleSignIn(IAuthMethod.MUNI)}
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
      </CardBox>
    </PageTemplate>
  );
};
