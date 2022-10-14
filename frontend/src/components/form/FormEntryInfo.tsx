import { Typography } from "@mui/material";
import { FormCardContainer } from "./FormCardContainer";

export const FormEntryInfo = () => (
  <FormCardContainer title="Úvodní informace">
    <Typography width="100%">
      Vítáme Vás na pracovišti magnetické rezonance (MR). Jde o moderní zobrazovací metodu používanou v medicíně, která
      na rozdíl od RTG vyšetření nepoužívá ionizující záření. Principem metody je sledování chování tkání a orgánů ve
      velmi silném magnetickém poli. Měření je doprovázeno zvýšeným hlukem. Vyšetření není bolestivé, ale elektronika
      nebo kovový materiál v těle či na jeho povrchu může vlivem magnetického pole poškodit Vaše zdraví. Proto je z
      hlediska vaší bezpečnosti velmi důležité dbát pokynů obsluhy MR přístroje a pravdivě vyplnit následující dotazník.
      Pokud budete mít nějaké dotazy nebo nejasnosti, obraťte se na obsluhu MR přístroje.
    </Typography>
    <Typography
      width="100%"
      paddingTop="1rem"
    >
      V průběhu vyšetření je důležité dbát pokynů laboranta. Zejména, snažit se minimalizovat jakýkoliv pohyb v průběhu
      měření.
    </Typography>
  </FormCardContainer>
);
