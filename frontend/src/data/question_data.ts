type QuestionPartNumber = 1 | 2;

export interface IQuestionData {
  id: string;
  text: string;
  partNumber: QuestionPartNumber;
  isValid: boolean;
}

export const questions: IQuestionData[] = [
  {
    id: "p1q01",
    text: "Prodělal(a) jste operaci hlavy (mozku)?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q02",
    text: "Prodělal(a) jste oční operaci nebo ušní operaci?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q03",
    text: "Máte zavedenou nějakou svorku či stent (např. vtepně či žíle)?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q04",
    text: "Máte rovnátka, retenční drátek nebo vyndavací zubní protézu?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q05",
    text: "Máte umělý kloub (např. kyčelní), protézu?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q06",
    text: "Máte náplast pro transdermální podávání léků?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q07",
    text: "Máte tetování nebo permanentní make-up?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q08",
    text: "Máte nějaké potíže, dysfunkce ledvin?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q09",
    text: "Trpíte klaustrofobií?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q10",
    text: "Máte nasazené kontaktní čočky?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q11",
    text: "Máte nasazený piercing?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q12",
    text: "Prodělal(a) jste srdeční operaci?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p1q13",
    text: "Měl(a) jste zlomeninu s použitím vnitřní kovové dlahy / šroubů?",
    partNumber: 1,
    isValid: true,
  },
  {
    id: "p2q01",
    text: "Máte/měl jste někdy zavedený jakýkoli stimulační implantát (např. kardiostimulátor, defibrilátor apod.)?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q02",
    text: "Máte insulinovou nebo infuzní pumpu?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q03",
    text: "Máte/měl jste někdy zavedený kochleární implantát?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q04",
    text: "Máte/měl jste zavedené jakékoli jiné elektronické zařízení?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q05",
    text: "Máte umělou srdeční chlopeň?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q06",
    text: "Prodělal(a) jste úraz oka způsobený kovovou střepinou?",
    partNumber: 2,
    isValid: true,
  },
  {
    id: "p2q07",
    text: "Je možné, že se ve Vašem těle nachází kovová střepina?",
    partNumber: 2,
    isValid: true,
  },
];
