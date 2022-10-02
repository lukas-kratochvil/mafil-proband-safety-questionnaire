import { Button, useTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/Auth";

export const LogOutButton = () => {
  const theme = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

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
