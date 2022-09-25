import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
      <Card
        sx={{
          bgcolor: theme.palette.primary.contrastText,
          maxWidth: "15rem",
          marginLeft: "0.5rem",
          marginRight: "1rem",
          paddingX: "0.75rem",
          paddingY: "0.5rem",
          display: "inline-flex",
          columnGap: "0.5rem",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <AccountCircleIcon />
        <Typography noWrap>{username}</Typography>
      </Card>
      <LogOutButton />
    </Grid>
  );
};
