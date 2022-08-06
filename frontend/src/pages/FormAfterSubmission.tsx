import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardBox } from "../components/card/CardBox";
import { PageTemplate } from "./PageTemplate";

export const FormAfterSubmission = () => {
  const navigate = useNavigate();

  return (
    <PageTemplate centerize>
      <CardBox
        title="Váš formulář byl úspěšně odeslán. Vyčkejte, prosím, na další pokyny operátora."
        width="100%"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          padding="1rem"
        >
          <Button
            variant="contained"
            onClick={() => navigate("/")}
          >
            Otevřít nový formulář
          </Button>
        </Grid>
      </CardBox>
    </PageTemplate>
  );
};
