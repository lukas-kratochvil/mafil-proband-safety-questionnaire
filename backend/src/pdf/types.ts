import { AnswerOption, Operator } from "@prisma/client";

export type PDFOperator = Pick<Operator, "name" | "surname">;

export type PDFEntityTexts = {
  text: string | undefined;
  secondaryText?: string;
};

export type PDFQuestionAnswer = PDFEntityTexts & {
  answer: AnswerOption;
  comment?: string;
};

type PDFNativeLanguage = {
  nativeName: string;
  nameCs: string;
};

export type PDFData = {
  isPhantom: boolean;
  operatorFinalizer: PDFOperator;
  operatorApprover?: PDFOperator;
  visitId: string;
  projectAcronym: string;
  measurementDate: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: PDFEntityTexts;
  nativeLanguage: PDFNativeLanguage;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: PDFEntityTexts;
  email?: string;
  phone?: string;
  answers: PDFQuestionAnswer[];
};
