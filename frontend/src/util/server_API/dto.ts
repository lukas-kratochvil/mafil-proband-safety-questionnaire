import { LocalizationKeys } from "@app/i18n";
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

export interface IWaitingRoomVisitFormDTO {
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
  answers: IProbandAnswerDTO[];
}

type QuestionHiddenByGendersWithoutId = Omit<IQuestionDTO, "id">;

export type WaitingRoomVisitFormAnswerIncludingQuestion = IProbandAnswerDTO & QuestionHiddenByGendersWithoutId;

export interface IWaitingRoomVisitFormIncludingQuestionsDTO extends Omit<IWaitingRoomVisitFormDTO, "answers"> {
  answersIncludingQuestions: WaitingRoomVisitFormAnswerIncludingQuestion[];
}

export interface IApprovalRoomVisitFormDTO extends IWaitingRoomVisitFormDTO {
  answers: IOperatorAnswerDTO[];
  additionalInfo: {
    projectId: string;
    projectAcronym: string;
    deviceId: string;
    deviceName: string;
    measuredAt: Date;
  };
}

export type ApprovalRoomVisitFormAnswerIncludingQuestion = IOperatorAnswerDTO & QuestionHiddenByGendersWithoutId;

export interface IApprovalRoomVisitFormIncludingQuestionsDTO extends Omit<IApprovalRoomVisitFormDTO, "answers"> {
  answersIncludingQuestions: ApprovalRoomVisitFormAnswerIncludingQuestion[];
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
  probandLanguageCode: LocalizationKeys;
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
