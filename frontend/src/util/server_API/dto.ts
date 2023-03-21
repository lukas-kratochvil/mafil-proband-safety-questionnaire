import { LocalizationKeys } from "@app/i18n";
import { AnswerOption } from "@app/interfaces/visit";

type OperatorRole = "MR" | "MR_HIGH_PERM";

export interface IOperatorDTO {
  id: string;
  name: string;
  surname: string;
  uco: string;
  email: string;
  role: OperatorRole;
}

interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

export interface IGenderDTO {
  id: string;
  code: string;
  translations: ITranslation[];
}

export interface INativeLanguageDTO {
  id: string;
  code: string;
  order: number | null;
  translations: ITranslation[];
}

export interface IHandednessDTO {
  id: string;
  code: string;
  translations: ITranslation[];
}

export interface IQuestionDTO {
  id: string;
  partNumber: number;
  mustBeApproved: boolean;
  translations: ITranslation[];
}

interface IAnswerDTO {
  questionId: string;
  answer: AnswerOption;
}

export interface ICreateProbandVisitFormInput {
  createVisitFormInput: {
    probandLanguageCode: LocalizationKeys;
    probandInfo: {
      name: string;
      surname: string;
      personalId: string;
      birthdate: Date;
      genderId: string;
      nativeLanguageId: string;
      heightCm: number;
      weightKg: number;
      visualCorrectionDioptre: number;
      handednessId: string;
      email: string;
      phone: string;
    };
    answers: IAnswerDTO[];
  };
}

export interface IVisitFormId {
  id: string;
}
