import { AnswerOption } from "@prisma/client";

export interface IPDFData {
  // phantom visit has operator name instead of the signature field
  finalizerId?: string;
  visitId: string;
  projectAcronym: string;
  measurementDate: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: string;
  nativeLanguage: string;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: string;
  email?: string;
  phone?: string;
  answers: IQuestionAnswer[];
}

export interface IQuestionAnswer {
  questionText: string;
  answer: AnswerOption;
  comment?: string;
}
