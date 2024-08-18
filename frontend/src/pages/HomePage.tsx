import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CardContainer } from "@app/components/card/CardContainer";
import { RoutingPath } from "@app/routing-paths";
import { PageContainer } from "./PageContainer";

const HomePage = () => {
  const { t } = useTranslation("translation", { keyPrefix: "homePage" });

  return (
    <PageContainer center>
      <CardContainer title={t("title")}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <Button
            variant="contained"
            component={Link}
            to={RoutingPath.PROBAND_FORM}
          >
            {t("openNewFormButton")}
          </Button>
        </Grid>
      </CardContainer>
    </PageContainer>
  );
};

export default HomePage;
