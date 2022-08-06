import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageTemplate } from "./PageTemplate";

export const FormAfterSubmission = () => {
  const navigate = useNavigate();

  return (
    <PageTemplate centerize>
      <Card
        sx={{
          border: 2,
          width: "100%",
        }}
      >
        <Typography
          textAlign="center"
          fontSize="1.25rem"
          fontWeight="bold"
          padding="1rem"
        >
          Váš formulář byl úspěšně odeslán. Vyčkejte, prosím, na další pokyny operátora.
        </Typography>
        <Divider />
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
      </Card>
    </PageTemplate>
  );
};
