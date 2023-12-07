import { LanguageCode } from "@app/i18n";
import { VisitState } from "@app/util/mafildb_API/dto";
import {
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  VisitFormAnswerIncludingQuestion,
} from "../util/server_API/dto";
import { IDevice } from "./device";
import { AnswerOption } from "./form";
import { IProject } from "./project";
import { ISubject } from "./subject";

export type ProbandVisitLanguageCode = LanguageCode | "";

interface IAnswer {
  questionId: string;
  answer: AnswerOption;
  comment: string;
}
export interface IVisit {
  uuid: string;
  visitId: string;
  created: Date;
  state: VisitState; // TODO: separate model VisitState and DTO VisitState
  isPhantom: boolean;
  measurementDate: Date;
  subject: ISubject;
  project: IProject;
  device: IDevice;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  answers: IAnswer[];
  finalizer: IOperatorDTO;
  finalizationDate: Date;
  approver: IOperatorDTO | null;
  approvalDate: Date | null;
  disapprovalReason: string;
}
// TODO: correct attributes

export type IRecentVisitsTableVisit = IVisit;
// TODO: correct attributes

export interface IDuplicatedVisitIncludingQuestions
  extends Omit<
    IVisit,
    "created" | "answers" | "finalizer" | "finalizationDate" | "approver" | "approvalDate" | "disapprovalReason"
  > {
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  handedness: IHandednessDTO;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
}

export interface IVisitDetailPDF {
  name: string; // also contains extension, for example: my_doc.pdf
  content: string; // Base64 encoded PDF content
}
// TODO: correct attributes

export interface IVisitDetail extends Pick<IVisit, "visitId" | "state" | "isPhantom"> {
  pdf: IVisitDetailPDF;
}
