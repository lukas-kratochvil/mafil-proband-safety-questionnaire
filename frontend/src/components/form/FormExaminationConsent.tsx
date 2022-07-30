import { Typography } from "@mui/material";
import { FormCard } from "./FormCard";

export const FormExaminationConsent = () => (
  <FormCard title="Souhlas s vyšetřením v Laboratoři multimodálního a funkčního zobrazování">
    <Typography minWidth="100%">
      Prohlašuji, že jsem četl/a informace k MR vyšetření (strana 1 až 2 tohoto
      dokumentu) a porozuměl/a jsem jejich smyslu. Prohlašuji, že jsem pravdivě
      vyplnil/a tento dotazník. Prohlašuji, že jsem byl/a poučena o výzkumné
      studii, k níž toto vyšetření náleží, členem výzkumného týmu a
      prostřednictvím samostatného informovaného souhlasu a souhlasím s
      realizací vyšetření.
    </Typography>
    <Typography minWidth="100%" paddingTop={2}>
      Beru na vědomí, že moje osobní údaje v rozsahu jméno, příjmení, podpis,
      datum narození, rodné číslo, pohlaví, stranová dominance, výška, váha,
      zraková korekce, mateřský jazyk, bezpečnostní otázky ke kontraindikacím MR
      vyšetření z tohoto dotazníku, naměřená data a kontaktní údaje (pro případ
      náhodného nálezu převzaté z informovaného souhlasu k výzkumné studii)
      budou na základě oprávněného zájmu správce – Masarykovy univerzity – za
      účelem zajištění nezbytných bezpečnostních a právních náležitostí
      souvisejících s vyšetřením v Laboratoři multimodálního a funkčního
      zobrazování po dobu 5 let uloženy na zabezpečených uložištích Masarykovy
      univerzity s omezeným přístupem. Po uplynutí této doby budou veškerá data
      uchovávaná v Laboratoři multimodálního a funkčního zobrazování
      anonymizována.
    </Typography>
    <Typography minWidth="100%" paddingTop={2}>
      Kontaktní údaje:
    </Typography>
    <Typography minWidth="100%">
      Laboratoř multimodálního a funkčního zobrazování, CEITEC MU, Masarykova
      univerzita, Kamenice 5, 625 00 Brno
    </Typography>
    <Typography minWidth="100%">kontaktní osoba: Michal Mikl</Typography>
    <Typography minWidth="100%">telefon: + 420 54949 6099</Typography>
    <Typography minWidth="100%">email: mafil@ceitec.muni.cz</Typography>
  </FormCard>
);
