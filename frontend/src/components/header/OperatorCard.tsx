import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, Typography } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";

export const OperatorCard = () => {
  const { operator } = useAuth();

  return (
    <Card
      sx={{
        bgcolor: ({ palette }) => palette.primary.contrastText,
        minWidth: 0,
        maxWidth: "15rem",
        width: "100%",
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
      <Typography noWrap>{`${operator?.name} ${operator?.surname}`}</Typography>
    </Card>
  );
};
