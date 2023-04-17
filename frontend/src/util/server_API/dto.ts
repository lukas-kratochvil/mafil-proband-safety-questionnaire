import { LanguageCode } from "@app/i18n";
import { AnswerOption } from "@app/model/form";

export type OperatorRole = "MR" | "MR_HIGH_PERM";

export interface IOperatorDTO {
  id: string;
  name: string;
  surname: string;
  uco: string;
  email: string;
  role: OperatorRole;
}

export interface ITranslation {
  text: string;
  language: {
    code: string;
  };
}

interface ITranslations {
  translations: ITranslation[];
}

export interface IGenderDTO extends ITranslations {
  id: string;
  code: string;
}

export interface INativeLanguageDTO extends ITranslations {
  id: string;
  code: string;
  order: number | null;
}

export interface IHandednessDTO extends ITranslations {
  id: string;
  code: string;
}

export interface IHTMLCardDTO {
  title: string;
  html: string;
}

export enum QuestionPartNumber {
  ONE = 1,
  TWO = 2,
}

export interface IQuestionDTO extends ITranslations {
  id: string;
  updatedAt: Date;
  partNumber: QuestionPartNumber;
  mustBeApproved: boolean;
  hiddenByGenders: {
    genderCode: string;
  }[];
}

interface IProbandAnswerDTO {
  questionId: string;
  answer: AnswerOption;
}

interface IOperatorAnswerDTO extends IProbandAnswerDTO {
  comment: string;
}

type VisitFormState = "NEW" | "IN_APPROVAL";

export interface IWaitingRoomTableVisitFormDTO {
  id: string;
  createdAt?: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: IHandednessDTO;
  email: string;
  phone: string;
}

export interface IWaitingRoomVisitFormDTO extends IWaitingRoomTableVisitFormDTO {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: IProbandAnswerDTO[];
}

export type QuestionHiddenByGendersWithoutId = Omit<IQuestionDTO, "id">;

export type VisitFormAnswerIncludingQuestion = IOperatorAnswerDTO & QuestionHiddenByGendersWithoutId;

export interface IWaitingRoomVisitFormIncludingQuestions extends IWaitingRoomTableVisitFormDTO {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

export interface IApprovalRoomTableVisitFormDTO extends IWaitingRoomTableVisitFormDTO {
  additionalInfo: {
    projectId: string;
    projectAcronym: string;
    deviceId: string;
    deviceName: string;
    measuredAt: Date;
  };
}

export interface IApprovalRoomVisitFormDTO extends IApprovalRoomTableVisitFormDTO {
  answers: IOperatorAnswerDTO[];
}

export interface IApprovalRoomVisitFormIncludingQuestionsDTO extends IApprovalRoomTableVisitFormDTO {
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

type AdditionalInfo = {
  projectId: string;
  projectAcronym: string;
  deviceId: string;
  deviceName: string;
  measuredAt: Date;
  finalizerId: string;
  finalizedAt: Date;
};

type CreateProbandInfoInput = {
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

type CreateVisitFormInput = CreateProbandInfoInput & {
  state: VisitFormState;
  additionalInfo: AdditionalInfo;
  probandLanguageCode: LanguageCode;
  answers: IOperatorAnswerDTO[];
};

export interface ICreateProbandVisitFormInput {
  createVisitFormInput: Omit<CreateVisitFormInput, "state" | "additionalInfo" | "answers"> & {
    answers: IProbandAnswerDTO[];
  };
}

export interface ICreateDuplicatedVisitFormForApprovalInput {
  createVisitFormInput: CreateVisitFormInput;
}

type UpdateVisitFormInput = Partial<CreateProbandInfoInput> & {
  id: string;
  state: Partial<Omit<VisitFormState, "NEW">>;
  additionalInfo: Partial<AdditionalInfo>;
  answers: Partial<IOperatorAnswerDTO>[];
};

export interface ISendVisitFormFromWaitingRoomForApprovalInput {
  updateVisitFormInput: Omit<UpdateVisitFormInput, "additionalInfo"> & {
    additionalInfo: AdditionalInfo;
  };
}
