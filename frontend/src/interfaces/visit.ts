import { ITranslatedEntityDTO } from "../util/server_API/dto";
import { QuestionPartNumber } from "./question";

export enum VisitState {
  NEW = "Nové",
  IN_APPROVAL = "Ve schvalování",
  APPROVED = "Schváleno, nepodepsáno",
  DISAPPROVED = "Neschváleno",
  FOR_SIGNATURE = "K podpisu",
  SIGNED = "Podepsáno",
  DELETED = "Smazáno",
}

export interface IVisit {
  id: string;
  createdAt: Date;
  visitId: string;
  state: VisitState;
  pdf: string;
  projectInfo: IProjectInfo;
  probandInfo: IProbandInfo;
  answers: IQac[];
}

interface IProjectInfo {
  projectId: string | null;
  projectAcronym: string | null;
  deviceId: string | null;
  deviceName: string | null;
  isPhantom: boolean;
  measurementDate: Date | null;
  disapprovalReason: string | null;
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export enum VisualCorrection {
  YES,
  NO,
}

export enum Handedness {
  RIGHT_HANDED,
  LEFT_HANDED,
  LEFT_HANDED_RETRAINED,
  UNDETERMINED,
}

interface IProbandInfo {
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  height: number;
  weight: number;
  gender: ITranslatedEntityDTO;
  nativeLanguage: ITranslatedEntityDTO;
  visualCorrection: VisualCorrection;
  visualCorrectionValue: number;
  handedness: ITranslatedEntityDTO;
  email: string;
  phone: string;
}

export enum AnswerOption {
  YES = "yes",
  NO = "no",
}

export interface IQac {
  questionId: string;
  partNumber: QuestionPartNumber;
  answer: AnswerOption;
  comment: string;
}
