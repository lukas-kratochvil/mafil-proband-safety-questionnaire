import { Avatar, Button, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { Header } from "../../header/Header";

export const LoginPage = () => {
  return (
    <>
      <Header />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px - 50px)" // 64px header, 50px navigation
      >
        <Card
          sx={{
            border: 2,
            width: "30rem"
          }}
        >
          <Typography
            textAlign='center'
            fontWeight='bold'
            fontSize={20}
            paddingY={1}
          >
            Bezpečnostní dotazník probanda
          </Typography>
          <Divider flexItem />
          <Typography
            sx={{
              paddingTop: 3,
              paddingLeft: "3rem",
            }}
          >
            Přihlásit se přes:
          </Typography>
          <Stack
            spacing={1}
            paddingTop="1rem"
            paddingBottom="2rem"
            paddingX="8rem"
          >
            <Button
              variant="outlined"
              href="/auth/waiting-room" // TODO: redirect to an appropriate authentication page
              startIcon={
                <Avatar
                  variant="square"
                  alt="MUNI logo"
                  src={"logo_muni.png"}
                  sx={{
                    marginRight: "0.5rem",
                    width: "2rem",
                    height: "2rem",
                  }}
                />
              }
            >
              MUNI
            </Button>
          </Stack>
        </Card>
      </Grid>
    </>
  );
}
