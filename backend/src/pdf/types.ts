import { AnswerOption, Operator } from "@prisma/client";

export type IPDFOperator = Pick<Operator, "name" | "surname">;

export type IPDFEntityTexts = {
  text: string | undefined;
  secondaryText?: string;
};

export type IPDFQuestionAnswer = IPDFEntityTexts & {
  answer: AnswerOption;
  comment?: string;
};

type IPDFNativeLanguage = {
  nativeName: string;
  nameCs: string;
};

export type IPDFData = {
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
  nativeLanguage: IPDFNativeLanguage;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: IPDFEntityTexts;
  email?: string;
  phone?: string;
  answers: IPDFQuestionAnswer[];
};
