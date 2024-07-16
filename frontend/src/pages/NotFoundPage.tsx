import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation("translation", { keyPrefix: "notFoundPage" });
  return (
    <Stack
      height="50vh"
      alignItems="center"
      justifyContent="center"
    >
      <Typography fontSize="2rem">{t("text")}</Typography>
    </Stack>
  );
};

export default NotFoundPage;
