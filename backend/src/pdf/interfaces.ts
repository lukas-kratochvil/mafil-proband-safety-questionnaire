import { AnswerOption, Operator } from "@prisma/client";

export type IPDFOperator = Pick<Operator, "name" | "surname">;

export interface IPDFQuestionAnswer {
  questionText: string;
  questionSecondaryText?: string;
  answer: AnswerOption;
  comment?: string;
}

export interface IPDFData {
  isPhantom: boolean;
  operatorFinalizer: IPDFOperator;
  operatorApprover?: IPDFOperator;
  visitId: string;
  projectAcronym: string;
  measurementDate: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: {
    text: string;
    secondaryText?: string;
  };
  nativeLanguage: {
    text: string;
    secondaryText?: string;
  };
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: {
    text: string;
    secondaryText?: string;
  };
  email?: string;
  phone?: string;
  answers: IPDFQuestionAnswer[];
}
