import { Typography } from "@mui/material";
import { BoldTextSpan } from "../text/BoldTextSpan";
import { FormCard } from "./FormCard";

export const FormBeforeExamination = () => (
  <FormCard title="Před vyšetřením">
    <Typography width="100%">
      Před vyšetřením si prosím&nbsp;
      <BoldTextSpan>odložte všechny elektricky vodivé/ kovové předměty</BoldTextSpan>
      &nbsp;(šperky, hodinky, gumičky, sponky, piercing) a součásti oděvu, které obsahují&nbsp;
      <BoldTextSpan>elektricky vodivé materiály</BoldTextSpan>
      &nbsp;např. podprsenka skovovými kosticemi, kovové nášivky, funkční prádlo sobsahem stříbra. Vyšetření probíhá za
      účelem vědeckého výzkumu. Účelem vyšetření není poskytování zdravotních služeb nebo zjišťování Vašeho zdravotního
      stavu. Sesbíraná data nebude vyhodnocovat lékař, ale vědecký pracovník. Vpřípadě, že by vědecký pracovník pojal
      podezření na možné zdravotní komplikace, máte právo být o tomto podezření informován/aa následně podezření
      zkonzultovat slékařem, což by bylo zajištěno výzkumným pracovníkem příslušné studie na základě Vašeho rozhodnutí
      vinformovaném souhlasu.
    </Typography>
  </FormCard>
);
