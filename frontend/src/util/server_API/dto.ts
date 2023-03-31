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

interface IHiddenByGender {
  genderCode: string;
}

export interface IQuestionHiddenByGendersDTO extends IQuestionDTO {
  hiddenByGenders: IHiddenByGender[];
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
