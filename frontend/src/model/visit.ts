import { LanguageCode } from "@app/i18n";
import { ApprovalState, SignatureState } from "@app/util/mafildb_API/dto";
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
  approvalState: ApprovalState;
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
  signatureState: SignatureState;
  disapprovalReason: string;
}

export type CreateVisit = Pick<IVisit, "uuid" | "visitId">;

// TODO: correct the type
export type IRecentVisitsTableVisit = IVisit;

export interface IDuplicatedVisitIncludingQuestions
  extends Omit<
    IVisit,
    | "created"
    | "approvalState"
    | "answers"
    | "finalizer"
    | "finalizationDate"
    | "approver"
    | "approvalDate"
    | "disapprovalReason"
    | "signatureState"
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

export interface IVisitDetail extends Pick<IVisit, "uuid" | "visitId" | "approvalState" | "isPhantom" | "signatureState"> {
  pdf: IVisitDetailPDF;
}
