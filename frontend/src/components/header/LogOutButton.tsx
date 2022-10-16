import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/auth/Auth";
import { defaultNS } from "../../i18n";

export const LogOutButton = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "common" });
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
