import { Box, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { FormCard } from "./FormCard";

const InlineBoldText = ({children}: PropsWithChildren) => {
  return (
    <Box display="inline" fontWeight="bold">
      {children}
    </Box>
  );
}

export const FormBeforeExamination = () => {
  return (
    <FormCard title={"Před vyšetřením"}>
      <Typography minWidth="100%" component="div">
        Před vyšetřením si prosím&nbsp;
        <InlineBoldText>odložte všechny elektricky vodivé/ kovové předměty&nbsp;</InlineBoldText>
        (šperky, hodinky, gumičky, sponky, piercing) a součásti oděvu, které obsahují&nbsp;
        <InlineBoldText>elektricky vodivé materiály&nbsp;</InlineBoldText>
        např. podprsenka skovovými kosticemi, kovové nášivky, funkční prádlo sobsahem stříbra. Vyšetření probíhá za účelem vědeckého výzkumu. Účelem vyšetření není poskytování zdravotních služeb nebo zjišťování Vašeho zdravotního stavu. Sesbíraná data nebude vyhodnocovat lékař, ale vědecký pracovník. Vpřípadě, že by vědecký pracovník pojal podezření na možné zdravotní komplikace, máte právo být o tomto podezření informován/aa následně podezření zkonzultovat slékařem, což by bylo zajištěno výzkumným pracovníkem příslušné studie na základě Vašeho rozhodnutí vinformovaném souhlasu.
      </Typography>
    </FormCard>
  );
}
