import { Button, Stack } from "@mui/material";
import { Header } from "../../header/Header";
import { FormBeforeExamination } from "./FormBeforeExamination";
import { FormEntryInfo } from "./FormEntryInfo";
import { FormExaminationConsent } from "./FormExaminationConsent";
import { FormHeader } from "./FormHeader"
import { FormProbandInfo } from "./FormProbandInfo";
import { FormQuestions } from "./FormQuestions";

const questions1: string[] = [
  "Prodělal(a) jste operaci hlavy (mozku)?",
  "Prodělal(a) jste oční operaci nebo ušní operaci?",
  "Máte zavedenou nějakou svorku či stent (např. vtepně či žíle)?",
  "Máte rovnátka, retenční drátek nebo vyndavací zubní protézu?",
  "Máte umělý kloub (např. kyčelní), protézu?",
  "Máte náplast pro transdermální podávání léků?",
  "Máte tetování nebo permanentní make-up?",
  "Máte nějaké potíže, dysfunkce ledvin?",
  "Trpíte klaustrofobií?",
  "Máte nasazené kontaktní čočky?",
  "Máte nasazený piercing?",
  "Prodělal(a) jste srdeční operaci?",
  "Měl(a) jste zlomeninu s použitím vnitřní kovové dlahy / šroubů?",
];

const questions2: string[] = [
  "Máte/měl jste někdy zavedený jakýkoli stimulační implantát (např. kardiostimulátor, defibrilátor apod.?",
  "Máte insulinovou nebo infuzní pumpu?",
  "Máte/měl jste někdy zavedený kochleární implantát?",
  "Máte/měl jste zavedené jakékoli jiné elektronické zařízení?",
  "Máte umělou srdeční chlopeň?",
  "Prodělal(a) jste úraz oka způsobený kovovou střepinou?",
  "Je možné, že se ve Vašem těle nachází kovová střepina?",
];

export const FormTemplate = () => {
  return (
    <>
      <Header />
      <Stack
        spacing={3}
        sx={{
          marginY: 3,
          marginX: '20%',
        }}
      >
        <FormHeader />
        <FormProbandInfo />
        <FormEntryInfo />
        <FormQuestions title="Část 1" questions={questions1} />
        <FormQuestions title="Část 2" questions={questions2} />
        <FormBeforeExamination />
        <FormExaminationConsent />
        <Stack
          sx={{
            paddingX: '40%',
          }}
        >
          <Button variant="contained">
            Souhlasím
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
