export const projects: string[] = ["Projekt 1", "Projekt 2", "Projekt 3"];

export const magnets: string[] = ["Magnet 1", "Magnet 2"];

export const genders: string[] = ["Muž", "Žena", "Jiné"];

export const nativeLanguages: string[] = ["Čeština", "Slovenština", "Angličtina", "Němčina", "Polština"];

export const visualCorrection: string[] = ["Ano", "Ne"];

export const sideDominance: string[] = ["Pravák", "Levák", "Přeučený levák", "Neurčeno"];

export interface IQuestionData {
  id: string;
  text: string;
}

export const questions1: IQuestionData[] = [
  {
    id: "p1q01",
    text: "Prodělal(a) jste operaci hlavy (mozku)?",
  },
  {
    id: "p1q02",
    text: "Prodělal(a) jste oční operaci nebo ušní operaci?",
  },
  {
    id: "p1q03",
    text: "Máte zavedenou nějakou svorku či stent (např. vtepně či žíle)?",
  },
  {
    id: "p1q04",
    text: "Máte rovnátka, retenční drátek nebo vyndavací zubní protézu?",
  },
  {
    id: "p1q05",
    text: "Máte umělý kloub (např. kyčelní), protézu?",
  },
  {
    id: "p1q06",
    text: "Máte náplast pro transdermální podávání léků?",
  },
  {
    id: "p1q07",
    text: "Máte tetování nebo permanentní make-up?",
  },
  {
    id: "p1q08",
    text: "Máte nějaké potíže, dysfunkce ledvin?",
  },
  {
    id: "p1q09",
    text: "Trpíte klaustrofobií?",
  },
  {
    id: "p1q10",
    text: "Máte nasazené kontaktní čočky?",
  },
  {
    id: "p1q11",
    text: "Máte nasazený piercing?",
  },
  {
    id: "p1q12",
    text: "Prodělal(a) jste srdeční operaci?",
  },
  {
    id: "p1q13",
    text: "Měl(a) jste zlomeninu s použitím vnitřní kovové dlahy / šroubů?",
  },
];

export const questions2: IQuestionData[] = [
  {
    id: "p2q01",
    text: "Máte/měl jste někdy zavedený jakýkoli stimulační implantát (např. kardiostimulátor, defibrilátor apod.)?",
  },
  {
    id: "p2q02",
    text: "Máte insulinovou nebo infuzní pumpu?",
  },
  {
    id: "p2q03",
    text: "Máte/měl jste někdy zavedený kochleární implantát?",
  },
  {
    id: "p2q04",
    text: "Máte/měl jste zavedené jakékoli jiné elektronické zařízení?",
  },
  {
    id: "p2q05",
    text: "Máte umělou srdeční chlopeň?",
  },
  {
    id: "p2q06",
    text: "Prodělal(a) jste úraz oka způsobený kovovou střepinou?",
  },
  {
    id: "p2q07",
    text: "Je možné, že se ve Vašem těle nachází kovová střepina?",
  },
];
