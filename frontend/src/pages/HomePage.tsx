import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CardContainer } from "@components/card/CardContainer";
import { defaultNS } from "@i18n";
import { RoutingPaths } from "@routing-paths";
import { PageContainer } from "./PageContainer";

const HomePage = () => {
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
            onClick={() => navigate(RoutingPaths.PROBAND_FORM)}
          >
            {t("openNewFormButton")}
          </Button>
        </Grid>
      </CardContainer>
    </PageContainer>
  );
};

export default HomePage;
