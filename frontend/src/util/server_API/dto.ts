import { LocalizationKeys } from "@app/i18n";
import { AnswerOption } from "@app/model/visit";

export type OperatorRole = "MR" | "MR_HIGH_PERM";

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

interface IProbandAnswerDTO {
  questionId: string;
  answer: AnswerOption;
}

interface IOperatorAnswerDTO extends IProbandAnswerDTO {
  comment: string;
}

export interface IWaitingRoomVisitFormDTO {
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
  answers: IProbandAnswerDTO[];
}

export interface IApprovalRoomVisitFormDTO extends IWaitingRoomVisitFormDTO {
  answers: IOperatorAnswerDTO[];
  additionalInfo: {
    projectId: string;
    deviceId: string;
    measuredAt: Date;
  };
}

interface ICreateVisitFormInput {
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
  answers: IProbandAnswerDTO[];
}

export interface ICreateProbandVisitFormInput {
  createVisitFormInput: ICreateVisitFormInput;
}

type VisitFormState = "NEW" | "IN_APPROVAL";

export interface ICreateDuplicatedVisitFormForApprovalInput {
  createVisitFormInput: ICreateVisitFormInput & {
    answers: IOperatorAnswerDTO[];
    state: VisitFormState;
    additionalInfo: {
      projectId: string;
      projectAcronym: string;
      deviceId: string;
      deviceName: string;
      measuredAt: Date;
      finalizerId: string;
      finalizedAt: Date;
    };
  };
}
