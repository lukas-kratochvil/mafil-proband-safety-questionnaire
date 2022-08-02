import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { Header } from "../components/header/Header";

export const FormAfterSubmission = () => (
  <>
    <Header />
    <Stack
      spacing={3}
      sx={{
        marginX: "20rem",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)", // 64px header
      }}
    >
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
    </Stack>
  </>
);
