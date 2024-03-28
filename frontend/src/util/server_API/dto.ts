import type { LanguageCode } from "@app/i18n/i18n";
import type { AnswerOption } from "@app/model/form";
import type { MDB_LanguageDTO } from "../mafildb_API/dto";

export type OperatorRole = "MR" | "MR_HIGH_PERM";

export type OperatorDTO = {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: OperatorRole;
};

export type OperatorAuthInput = Pick<OperatorDTO, "name" | "surname" | "username" | "email">;

export type Translation = {
  text: string;
  language: {
    code: string;
  };
};

type Translations = {
  translations: Translation[];
};

export type GenderCode = "M" | "F" | "O";

export type GenderDTO = Translations & {
  id: string;
  code: GenderCode;
  order: number;
};

export type HandednessCode = "RH" | "LH" | "FL" | "UN";

export type HandednessDTO = Translations & {
  id: string;
  code: HandednessCode;
  order: number;
};

export type HTMLCardDTO = {
  title: string;
  html: string;
};

type QuestionPartNumber = 1 | 2;

export type QuestionDTO = Translations & {
  id: string;
  updatedAt: Date;
  partNumber: QuestionPartNumber;
  mustBeApproved: boolean;
  order: number;
  hiddenByGenders: {
    genderCode: GenderCode;
  }[];
};

export type OrderedQuestionDTO = QuestionDTO & {
  order: number;
};

type ProbandAnswerDTO = {
  questionId: string;
  answer: AnswerOption;
};

type OperatorAnswerDTO = ProbandAnswerDTO & {
  comment: string;
};

export type VisitFormState = "NEW" | "IN_APPROVAL" | "SENT_TO_MAFILDB" | "PDF_GENERATED";

export type WaitingRoomTableVisitFormDTO = {
  id: string;
  state: VisitFormState;
  createdAt?: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: GenderDTO;
  nativeLanguageCode: MDB_LanguageDTO["code"];
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: HandednessDTO;
  email: string;
  phone: string;
};

export type WaitingRoomVisitFormDTO = WaitingRoomTableVisitFormDTO & {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: ProbandAnswerDTO[];
};

export type QuestionHiddenByGendersWithoutId = Omit<OrderedQuestionDTO, "id">;

export type VisitFormAnswerIncludingQuestion = OperatorAnswerDTO & QuestionHiddenByGendersWithoutId;

export type WaitingRoomVisitFormIncludingQuestions = WaitingRoomTableVisitFormDTO & {
  probandLanguageCode: LanguageCode;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

export type ApprovalRoomTableVisitFormDTO = WaitingRoomTableVisitFormDTO & {
  additionalInfo: {
    projectUuid: string;
    deviceId: number;
    measuredAt: Date;
    finalizer: Pick<OperatorDTO, "username">;
    finalizedAt: Date;
  };
};

export type ApprovalRoomVisitFormDTO = ApprovalRoomTableVisitFormDTO & {
  probandLanguage: {
    code: LanguageCode;
  };
  answers: OperatorAnswerDTO[];
};

export type ApprovalRoomVisitFormIncludingQuestionsDTO = ApprovalRoomTableVisitFormDTO & {
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
  nativeLanguageCode: MDB_LanguageDTO["code"];
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
  answers: OperatorAnswerDTO[];
};

export type CreateProbandVisitFormInput = {
  createVisitFormInput: Omit<CreateVisitFormInput, "state" | "additionalInfo" | "answers"> & {
    answers: ProbandAnswerDTO[];
  };
};

export type CreateDuplicatedVisitFormForApprovalInput = {
  createVisitFormInput: CreateVisitFormInput;
};

type UpdateVisitFormInput = Partial<CreateProbandInfoInput> & {
  id: string;
  state: Partial<Omit<VisitFormState, "NEW">>;
  additionalInfo: Partial<AdditionalInfo>;
  answers: Partial<OperatorAnswerDTO>[] | undefined;
};

export type SendVisitFormFromWaitingRoomForApprovalInput = {
  updateVisitFormInput: Omit<UpdateVisitFormInput, "additionalInfo"> & {
    additionalInfo: AdditionalInfo;
  };
};

export type UpdateVisitFormStateInput = {
  updateVisitFormInput: Pick<UpdateVisitFormInput, "id" | "state">;
};

export type PdfDTO = {
  name: string; // also contains extension, for example: my_doc.pdf
  content: string; // Base64 encoded PDF content
};

export type GeneratePdfInput = {
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
