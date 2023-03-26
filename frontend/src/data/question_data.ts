import { IQuestionData, QuestionPartNumber } from "@app/model/question";

const questions1 = [
  "Prodělal(a) jste operaci hlavy (mozku)?",
  "Prodělal(a) jste oční operaci nebo ušní operaci?",
  "Máte zavedenou nějakou svorku či stent (např. v tepně či žíle)?",
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

const questions2 = [
  "Máte/měl(a) jste někdy zavedený jakýkoli stimulační implantát (např. kardiostimulátor, defibrilátor apod.)?",
  "Máte insulinovou nebo infuzní pumpu?",
  "Máte/měl(a) jste někdy zavedený kochleární implantát?",
  "Máte/měl(a) jste zavedené jakékoli jiné elektronické zařízení?",
  "Máte umělou srdeční chlopeň?",
  "Prodělal(a) jste úraz oka způsobený kovovou střepinou?",
  "Je možné, že se ve Vašem těle nachází kovová střepina?",
];

const createQuestions = (questions: string[], partNumber: QuestionPartNumber): IQuestionData[] =>
  questions.map(
    (text, index): IQuestionData => ({
      id: `p${partNumber}q${index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}`,
      text,
      partNumber,
    })
  );

export const questions: IQuestionData[] = [...createQuestions(questions1, 1), ...createQuestions(questions2, 2)];
