import { GenderCode } from "./genders";

type PartNumberType = 1 | 2;

type IQuestion = {
  partNumber: PartNumberType;
  order: number;
  csText: string;
  enText: string;
  hiddenByGender?: GenderCode[];
};

const questions: Omit<IQuestion, "order">[] = [
  {
    partNumber: 1,
    csText: "Jste těhotná?",
    enText: "Are you pregnant?",
    hiddenByGender: ["M"],
  },
  {
    partNumber: 1,
    csText: "Prodělal(a) jste operaci hlavy (mozku)?",
    enText: "Have you had head (brain) surgery?",
  },
  {
    partNumber: 1,
    csText: "Prodělal(a) jste oční operaci nebo ušní operaci?",
    enText: "Have you had eye surgery or ear surgery?",
  },
  {
    partNumber: 1,
    csText: "Máte zavedenou nějakou svorku či stent (např. v tepně či žíle)?",
    enText: "Do you have a clamp or stent inserted (e.g. in an artery or vein)?",
  },
  {
    partNumber: 1,
    csText: "Máte rovnátka, retenční drátek nebo vyndavací zubní protézu?",
    enText: "Do you have braces, a retention wire or a removable denture?",
  },
  {
    partNumber: 1,
    csText: "Máte umělý kloub (např. kyčelní), protézu?",
    enText: "Do you have an artificial joint (e.g. hip), a prosthesis?",
  },
  {
    partNumber: 1,
    csText: "Máte náplast pro transdermální podávání léků?",
    enText: "Do you have a transdermal patch?",
  },
  {
    partNumber: 1,
    csText: "Máte tetování nebo permanentní make-up?",
    enText: "Do you have a tattoo or permanent makeup?",
  },
  {
    partNumber: 1,
    csText: "Máte nějaké potíže, dysfunkce ledvin?",
    enText: "Do you have any problems, kidney dysfunction?",
  },
  {
    partNumber: 1,
    csText: "Trpíte klaustrofobií?",
    enText: "Do you suffer from claustrophobia?",
  },
  {
    partNumber: 1,
    csText: "Máte nasazené kontaktní čočky?",
    enText: "Are you wearing contact lenses?",
  },
  {
    partNumber: 1,
    csText: "Máte nasazený piercing?",
    enText: "Do you have piercings?",
  },
  {
    partNumber: 1,
    csText: "Prodělal(a) jste srdeční operaci?",
    enText: "Have you had heart surgery?",
  },
  {
    partNumber: 1,
    csText: "Měl(a) jste zlomeninu s použitím vnitřní kovové dlahy / šroubů?",
    enText: "Have you had a fracture using an internal metal plate / screws?",
  },
  {
    partNumber: 2,
    csText:
      "Máte/měl(a) jste někdy zavedený jakýkoli stimulační implantát (např. kardiostimulátor, defibrilátor apod.)?",
    enText: "Do you/have you ever had any pacing implant (e.g. pacemaker, defibrillator, etc.) inserted?",
  },
  {
    partNumber: 2,
    csText: "Máte insulinovou nebo infuzní pumpu?",
    enText: "Do you have an insulin or infusion pump?",
  },
  {
    partNumber: 2,
    csText: "Máte/měl(a) jste někdy zavedený kochleární implantát?",
    enText: "Do you have/have you ever had a cochlear implant?",
  },
  {
    partNumber: 2,
    csText: "Máte/měl(a) jste zavedené jakékoli jiné elektronické zařízení?",
    enText: "Do you have/have you installed any other electronic devices?",
  },
  {
    partNumber: 2,
    csText: "Máte umělou srdeční chlopeň?",
    enText: "Do you have an artificial heart valve?",
  },
  {
    partNumber: 2,
    csText: "Prodělal(a) jste úraz oka způsobený kovovou střepinou?",
    enText: "Have you experienced an eye injury caused by a metal splinter?",
  },
  {
    partNumber: 2,
    csText: "Je možné, že se ve Vašem těle nachází kovová střepina?",
    enText: "Is it possible that there is a metal fragment in your body?",
  },
];

const orderedQuestions: IQuestion[] = questions.map((question, i) => ({
  ...question,
  order: (i + 1) * 10, // multiplying by 10 makes space for possible future additions
}));

export default orderedQuestions;
