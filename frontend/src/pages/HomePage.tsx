import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardContainer } from "../components/card/CardContainer";
import { PageContainer } from "./PageContainer";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer centerize>
      <CardContainer title="Váš formulář byl úspěšně odeslán. Vyčkejte, prosím, na další pokyny operátora.">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <Button
            variant="contained"
            onClick={() => navigate("/form")}
          >
            Otevřít nový formulář
          </Button>
        </Grid>
      </CardContainer>
    </PageContainer>
  );
};
