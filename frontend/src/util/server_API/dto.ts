import { type LanguageCode } from "@app/i18n/i18n";
import type { AnswerOption } from "@app/model/form";
import type { MDB_ILanguageDTO } from "../mafildb_API/dto";

export type OperatorRole = "MR" | "MR_HIGH_PERM";

export type IOperatorDTO = {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: OperatorRole;
};

export type IOperatorAuthInput = Pick<IOperatorDTO, "name" | "surname" | "username" | "email">;

export type ITranslation = {
  text: string;
  language: {
    code: string;
  };
};

type ITranslations = {
  translations: ITranslation[];
};

export type GenderCode = "M" | "F" | "O";

export type IGenderDTO = ITranslations & {
  id: string;
  code: GenderCode;
  order: number;
};

export type HandednessCode = "RH" | "LH" | "FL" | "UN";

export type IHandednessDTO = ITranslations & {
  id: string;
  code: HandednessCode;
  order: number;
};

export type IHTMLCardDTO = {
  title: string;
  html: string;
};

type QuestionPartNumber = 1 | 2;

export type IQuestionDTO = ITranslations & {
  id: string;
  updatedAt: Date;
  partNumber: QuestionPartNumber;
  mustBeApproved: boolean;
  order: number;
  hiddenByGenders: {
    genderCode: GenderCode;
  }[];
};

export type IOrderedQuestionDTO = IQuestionDTO & {
  order: number;
};

type IProbandAnswerDTO = {
  questionId: string;
  answer: AnswerOption;
};

type IOperatorAnswerDTO = IProbandAnswerDTO & {
  comment: string;
};

export type VisitFormState = "NEW" | "IN_APPROVAL" | "SENT_TO_MAFILDB" | "PDF_GENERATED";

export type IWaitingRoomTableVisitFormDTO = {
  id: string;
  state: VisitFormState;
  createdAt?: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: IGenderDTO;
  nativeLanguageCode: MDB_ILanguageDTO["code"];
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: IHandednessDTO;
  email: string;
  phone: string;
};

export type IWaitingRoomVisitFormDTO = IWaitingRoomTableVisitFormDTO & {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: IProbandAnswerDTO[];
};

export type QuestionHiddenByGendersWithoutId = Omit<IOrderedQuestionDTO, "id">;

export type VisitFormAnswerIncludingQuestion = IOperatorAnswerDTO & QuestionHiddenByGendersWithoutId;

export type IWaitingRoomVisitFormIncludingQuestions = IWaitingRoomTableVisitFormDTO & {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

export type IApprovalRoomTableVisitFormDTO = IWaitingRoomTableVisitFormDTO & {
  additionalInfo: {
    projectUuid: string;
    deviceId: number;
    measuredAt: Date;
    finalizer: Pick<IOperatorDTO, "username">;
    finalizedAt: Date;
  };
};

export type IApprovalRoomVisitFormDTO = IApprovalRoomTableVisitFormDTO & {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: IOperatorAnswerDTO[];
};

export type IApprovalRoomVisitFormIncludingQuestionsDTO = IApprovalRoomTableVisitFormDTO & {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

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
  nativeLanguageCode: MDB_ILanguageDTO["code"];
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

export type ICreateProbandVisitFormInput = {
  createVisitFormInput: Omit<CreateVisitFormInput, "state" | "additionalInfo" | "answers"> & {
    answers: IProbandAnswerDTO[];
  };
};

export type ICreateDuplicatedVisitFormForApprovalInput = {
  createVisitFormInput: CreateVisitFormInput;
};

type UpdateVisitFormInput = Partial<CreateProbandInfoInput> & {
  id: string;
  state: Partial<Omit<VisitFormState, "NEW">>;
  additionalInfo: Partial<AdditionalInfo>;
  answers: Partial<IOperatorAnswerDTO>[] | undefined;
};

export type ISendVisitFormFromWaitingRoomForApprovalInput = {
  updateVisitFormInput: Omit<UpdateVisitFormInput, "additionalInfo"> & {
    additionalInfo: AdditionalInfo;
  };
};

export type IUpdateVisitFormStateInput = {
  updateVisitFormInput: Pick<UpdateVisitFormInput, "id" | "state">;
};

export type IPdfDTO = {
  name: string; // also contains extension, for example: my_doc.pdf
  content: string; // Base64 encoded PDF content
};

export type IGeneratePdfInput = {
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
};
