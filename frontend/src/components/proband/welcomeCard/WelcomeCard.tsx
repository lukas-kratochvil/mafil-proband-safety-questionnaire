import { Card, Grid } from "@mui/material";
import { TypographyText } from "./TypographyText";

export const WelcomeCard = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 64px - 50px)" // 64px header, 50px top-menu
    >
      <Card
        sx={{
          marginBottom: 20,
          padding: 4,
          border: 5,
          borderColor: 'green',
          bgcolor: 'yellow',
        }}
      >
        <TypographyText text={"Vítejte na pracovišti magnetické rezonance (MR)."} />
        <TypographyText text={"Vyčkejte, prosím, až Vám operátor zpřístupní bezpečnostní formulář."} />
      </Card>
    </Grid>
  );
};
