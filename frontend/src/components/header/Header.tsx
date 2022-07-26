import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import { IAuth } from "../../App";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";

interface IHeaderProps {
  auth?: IAuth;
}

export const Header = ({ auth }: IHeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
        >
          <Box
            component="img"
            alt="CEITEC-MAFIL logo"
            src="/logo_mafil.png"
            sx={{
              height: 40,
            }}
          />
          {auth !== undefined && <LoginOperator username={auth.username} />}
          <LanguageMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
