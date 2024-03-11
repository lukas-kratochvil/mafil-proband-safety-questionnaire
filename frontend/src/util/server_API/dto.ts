import { LanguageCode } from "@app/i18n/i18n";
import { AnswerOption } from "@app/model/form";
import { INativeLanguage } from "@app/model/language";

export type OperatorRole = "MR" | "MR_HIGH_PERM";

export interface IOperatorDTO {
  id: string;
  name: string;
  surname: string;
  username: string;
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
  order: number;
}

export interface IHandednessDTO extends ITranslations {
  id: string;
  code: string;
  order: number;
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
  order: number;
  hiddenByGenders: {
    genderCode: string;
  }[];
}

export interface IOrderedQuestionDTO extends IQuestionDTO {
  order: number;
}

interface IProbandAnswerDTO {
  questionId: string;
  answer: AnswerOption;
}

interface IOperatorAnswerDTO extends IProbandAnswerDTO {
  comment: string;
}

export type VisitFormState = "NEW" | "IN_APPROVAL" | "SENT_TO_MAFILDB" | "PDF_GENERATED";

export interface IWaitingRoomTableVisitFormDTO {
  id: string;
  state: VisitFormState;
  createdAt?: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguage;
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

export type QuestionHiddenByGendersWithoutId = Omit<IOrderedQuestionDTO, "id">;

export type VisitFormAnswerIncludingQuestion = IOperatorAnswerDTO & QuestionHiddenByGendersWithoutId;

export interface IWaitingRoomVisitFormIncludingQuestions extends IWaitingRoomTableVisitFormDTO {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

export interface IApprovalRoomTableVisitFormDTO extends IWaitingRoomTableVisitFormDTO {
  additionalInfo: {
    projectUuid: string;
    deviceId: number;
    measuredAt: Date;
    finalizer: Pick<IOperatorDTO, "username">;
    finalizedAt: Date;
  };
}

export interface IApprovalRoomVisitFormDTO extends IApprovalRoomTableVisitFormDTO {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: IOperatorAnswerDTO[];
}

export interface IApprovalRoomVisitFormIncludingQuestionsDTO extends IApprovalRoomTableVisitFormDTO {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

type AdditionalInfo = {
  projectUuid: string;
  deviceId: number;
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
  nativeLanguageId: number;
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
  answers: Partial<IOperatorAnswerDTO>[] | undefined;
};

export interface ISendVisitFormFromWaitingRoomForApprovalInput {
  updateVisitFormInput: Omit<UpdateVisitFormInput, "additionalInfo"> & {
    additionalInfo: AdditionalInfo;
  };
}

export interface IUpdateVisitFormStateInput {
  updateVisitFormInput: Pick<UpdateVisitFormInput, "id" | "state">;
}

export interface IPdfDTO {
  name: string; // also contains extension, for example: my_doc.pdf
  content: string; // Base64 encoded PDF content
}

export interface IGeneratePdfInput {
  visitId: string;
  isPhantom: boolean;
  probandLanguageCode?: LanguageCode;
  projectAcronym: string;
  measuredAt: Date;
  finalizerUsername: string;
  approverUsername?: string;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  genderCode: string;
  nativeLanguage: {
    nativeName: string;
    nameCs: string;
  };
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handednessCode: string;
  email: string;
  phone: string;
  answers?: {
    questionId: string;
    answer: AnswerOption;
    comment: string | undefined;
  }[];
}
