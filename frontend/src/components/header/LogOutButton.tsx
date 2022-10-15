import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../../hooks/auth/Auth";

export const LogOutButton = () => {
  const { logOut } = useAuth();

  return (
    <Button
      variant="contained"
      onClick={logOut}
      sx={{
        bgcolor: ({ palette }) => palette.common.black,
        color: ({ palette }) => palette.primary.contrastText,
        "&:hover": {
          bgcolor: ({ palette }) => palette.common.black,
          color: red[200],
        },
      }}
    >
      Odhlásit se
    </Button>
  );
};
