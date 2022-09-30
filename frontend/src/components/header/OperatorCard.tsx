import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";

export const OperatorCard = () => {
  const { username } = useAuth();
  const theme = useTheme();

  return (
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
  );
};
