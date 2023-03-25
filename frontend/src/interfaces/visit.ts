import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "../util/server_API/dto";
import { QuestionPartNumber } from "./question";

export enum VisitStateDEV {
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
  state: VisitStateDEV;
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
  measuredAt: Date | null;
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
  heightCm: number;
  weightKg: number;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  visualCorrection: VisualCorrection;
  visualCorrectionDioptre: number;
  handedness: IHandednessDTO;
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
