import { AnswerOption, Operator } from "@prisma/client";

export type IPDFOperator = Pick<Operator, "name" | "surname">;

export interface IPDFEntityTexts {
  text: string;
  secondaryText?: string;
}

export interface IPDFQuestionAnswer extends IPDFEntityTexts {
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
  gender: IPDFEntityTexts;
  nativeLanguage: {
    nativeName: string;
    nameCs: string;
  };
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: IPDFEntityTexts;
  email?: string;
  phone?: string;
  answers: IPDFQuestionAnswer[];
}
