import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { PageTemplate } from "./PageTemplate";

export const FormAfterSubmission = () => (
  <PageTemplate centerize>
    <Card
      sx={{
        border: 2,
        width: "100%",
      }}
    >
      <Typography
        textAlign="center"
        fontSize={20}
        fontWeight="bold"
        padding={2}
      >
        Váš formulář byl úspěšně odeslán. Vyčkejte, prosím, na další pokyny operátora.
      </Typography>
      <Divider />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        margin={2}
      >
        <Button
          variant="contained"
          href="/"
        >
          Otevřít nový formulář
        </Button>
      </Grid>
    </Card>
  </PageTemplate>
);
