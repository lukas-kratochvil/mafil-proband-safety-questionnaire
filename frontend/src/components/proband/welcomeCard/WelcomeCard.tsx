import { Card } from "@mui/material";
import { TypographyText } from "./TypographyText";

export const WelcomeCard = () => {
  return (
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
  );
};
