import { QuestionPartNumber } from "./question";

export enum VisitState {
  NEW = "Nové",
  IN_APPROVAL = "Ve schvalování",
  APPROVED = "Schváleno",
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
  projectId: string;
  project: string | null;
  deviceId: string;
  device: string | null;
  isPhantom: boolean;
  measurementDate: Date | null;
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

export enum SideDominance {
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
  gender: Gender;
  nativeLanguage: string; // TODO: object stored in the database
  visualCorrection: VisualCorrection;
  visualCorrectionValue: number;
  sideDominance: SideDominance;
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
