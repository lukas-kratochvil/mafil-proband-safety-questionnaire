import { type LanguageCode } from "@app/i18n/i18n";
import type { MDB_IAnswerDTO, MDB_IVisitDTO } from "@app/util/mafildb_API/dto";
import type {
  IGenderDTO,
  IHandednessDTO,
  IOperatorDTO,
  VisitFormAnswerIncludingQuestion,
} from "@app/util/server_API/dto";
import type { IDevice } from "./device";
import type { IProject } from "./project";
import type { ISubject } from "./subject";
import type { IVisitPDF } from "./visitPdf";

export type ProbandVisitLanguageCode = LanguageCode | "";

type IAnswer = {
  questionId: MDB_IAnswerDTO["question_id"];
  answer: MDB_IAnswerDTO["answer"];
  comment: MDB_IAnswerDTO["comment"];
};

export type IVisit = {
  uuid: MDB_IVisitDTO["uuid"];
  visitId: MDB_IVisitDTO["visit_name"];
  created: MDB_IVisitDTO["created"];
  approvalState: MDB_IVisitDTO["checked"];
  isPhantom: MDB_IVisitDTO["is_phantom"];
  measurementDate: MDB_IVisitDTO["date"];
  subject: ISubject;
  project: IProject;
  device: IDevice;
  heightCm: MDB_IVisitDTO["height"];
  weightKg: MDB_IVisitDTO["weight"];
  visualCorrectionDioptre: MDB_IVisitDTO["visual_correction_dioptre"];
  answers: IAnswer[];
  finalizer: IOperatorDTO;
  finalizationDate: MDB_IVisitDTO["registration_finalize_date"];
  approver: IOperatorDTO | null;
  approvalDate: MDB_IVisitDTO["registration_approve_date"];
  signatureState: MDB_IVisitDTO["registration_signature_status"];
  disapprovalReason: MDB_IVisitDTO["registration_disapprove_reason"];
};

export type CreatedVisitData = Pick<IVisit, "uuid" | "visitId">;

// TODO: correct the type
export type IRecentVisitsTableVisit = IVisit;

export type IDuplicatedVisitIncludingQuestions = Omit<
  IVisit,
  | "created"
  | "approvalState"
  | "signatureState"
  | "answers"
  | "finalizer"
  | "finalizationDate"
  | "approver"
  | "approvalDate"
  | "disapprovalReason"
> & {
  gender: IGenderDTO;
  handedness: IHandednessDTO;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

export type IVisitDetailPDF = Pick<IVisitPDF, "name" | "content">;

export type IVisitDetail = Pick<IVisit, "uuid" | "visitId" | "approvalState" | "isPhantom" | "signatureState"> & {
  pdf: IVisitDetailPDF;
};
