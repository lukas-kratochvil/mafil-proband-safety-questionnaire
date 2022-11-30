import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "@App";
import { CardContainer } from "@components/card/CardContainer";
import { defaultNS } from "@i18n";
import { PageContainer } from "./PageContainer";

export const HomePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "homePage" });
  const navigate = useNavigate();

  return (
    <PageContainer centerize>
      <CardContainer title={t("title")}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <Button
            variant="contained"
            onClick={() => navigate(UrlBasePaths.PROBAND_FORM)}
          >
            {t("openNewFormButton")}
          </Button>
        </Grid>
      </CardContainer>
    </PageContainer>
  );
};
