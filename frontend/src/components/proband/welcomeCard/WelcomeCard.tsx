import { Card } from "@mui/material";
import { Header } from "../../header/Header";
import { MainContainer } from "../../MainContainer";
import { TypographyText } from "./TypographyText";

export const WelcomeCard = () => {
  return (
    <>
      <Header />
      <MainContainer>
        <Card
          sx={{
            marginBottom: '5%',
            padding: 4,
            border: 5,
            borderColor: 'green',
            bgcolor: 'yellow',
          }}
        >
          <TypographyText text={"Vítejte na pracovišti magnetické rezonance (MR)."} />
          <TypographyText text={"Vyčkejte, prosím, až Vám operátor zpřístupní bezpečnostní formulář."} />
        </Card>
      </MainContainer>
    </>
  );
};
