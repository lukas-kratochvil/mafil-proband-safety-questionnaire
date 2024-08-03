import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/hooks/auth/auth";

export const LogOutButton = () => {
  const { t } = useTranslation("translation", { keyPrefix: "common" });
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
      {t("logOutButton")}
    </Button>
  );
};
