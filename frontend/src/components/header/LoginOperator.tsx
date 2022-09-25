import { Button, Card, Grid, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/Auth";

export const LoginOperator = () => {
  const theme = useTheme();
  const { username, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Typography>Přihlášen:</Typography>
      <Card
        sx={{
          bgcolor: theme.palette.primary.contrastText,
          maxWidth: "15rem",
          marginLeft: "0.5rem",
          paddingX: "1rem",
          paddingY: "0.5rem",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography noWrap>{username}</Typography>
      </Card>
      <Button
        onClick={handleSignOut}
        sx={{
          marginLeft: "1rem",
          bgcolor: theme.palette.common.black,
          color: theme.palette.primary.contrastText,
          border: 1,
          "&:hover": {
            bgcolor: theme.palette.common.black,
            color: "pink",
          },
        }}
      >
        Odhlásit se
      </Button>
    </Grid>
  );
};
