import { Card, Grid, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";
import { LogOutButton } from "./LogOutButton";

export const LoginOperator = () => {
  const theme = useTheme();
  const { username } = useAuth();

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
          marginRight: "1rem",
          paddingX: "1rem",
          paddingY: "0.5rem",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography noWrap>{username}</Typography>
      </Card>
      <LogOutButton />
    </Grid>
  );
};
