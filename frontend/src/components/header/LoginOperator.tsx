import { Button, Card, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/Auth";

export const LoginOperator = () => {
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
          bgcolor: "white",
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
          marginLeft: "2rem",
          bgcolor: "black",
          color: "white",
          border: 1,
          "&:hover": {
            bgcolor: "black",
            color: "pink",
          },
        }}
      >
        Odhlásit se
      </Button>
    </Grid>
  );
};
