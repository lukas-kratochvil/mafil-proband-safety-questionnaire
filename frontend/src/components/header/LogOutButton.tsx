import { Button, useTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../../hooks/auth/Auth";

export const LogOutButton = () => {
  const theme = useTheme();
  const { logOut } = useAuth();

  const handleSignOut = () => logOut();

  return (
    <Button
      variant="contained"
      onClick={handleSignOut}
      sx={{
        bgcolor: theme.palette.common.black,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          bgcolor: theme.palette.common.black,
          color: red[200],
        },
      }}
    >
      Odhlásit se
    </Button>
  );
};
