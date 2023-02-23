import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";

const NotFoundPage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "notFoundPage" });
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
