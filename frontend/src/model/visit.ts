import { LanguageCode } from "@app/i18n";
import { IDeviceDTO, IProjectDTO, VisitState } from "@app/util/mafildb_API/dto";
import {
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  VisitFormAnswerIncludingQuestion,
} from "../util/server_API/dto";
import { AnswerOption } from "./form";

export enum VisualCorrection {
  YES,
  NO,
}

export type ProbandVisitLanguageCode = LanguageCode | "";

interface IAnswer {
  questionId: string;
  answer: AnswerOption;
  comment: string;
}

interface IVisit {
  date: Date;
  created: Date;
  visitId: string;
  state: VisitState;
  isPhantom: boolean;
  probandLanguageCode: ProbandVisitLanguageCode;
  projectUuid: string;
  deviceId: string;
  measurementDate: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  heightCm: number;
  weightKg: number;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  visualCorrectionDioptre: number;
  handedness: IHandednessDTO;
  email: string;
  phone: string;
  answers: IAnswer[];
}

export interface IRecentVisitsTableVisit
  extends Omit<IVisit, "projectUuid" | "deviceId" | "gender" | "nativeLanguage" | "handedness"> {
  project: IProjectDTO;
  device: IDeviceDTO;
  finalizer: IOperatorDTO;
}

export interface IDuplicatedVisitIncludingQuestions
  extends Omit<IVisit, "created" | "projectUuid" | "deviceId" | "answers"> {
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

export interface IVisitDetailPDF {
  name: string; // also contains extension, for example: my_doc.pdf
  content: string; // Base64 encoded PDF content
}

export interface IVisitDetail extends Pick<IVisit, "visitId" | "state" | "isPhantom"> {
  pdf: IVisitDetailPDF;
}
