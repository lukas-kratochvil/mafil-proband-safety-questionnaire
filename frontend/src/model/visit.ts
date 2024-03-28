import type { LanguageCode } from "@app/i18n/i18n";
import type { MDB_AnswerDTO, MDB_VisitDTO } from "@app/util/mafildb_API/dto";
import type { GenderDTO, HandednessDTO, OperatorDTO, VisitFormAnswerIncludingQuestion } from "@app/util/server_API/dto";
import type { Device } from "./device";
import type { Project } from "./project";
import type { Subject } from "./subject";
import type { VisitPDF } from "./visitPdf";

export type ProbandVisitLanguageCode = LanguageCode | "";

type Answer = {
  questionId: MDB_AnswerDTO["question_id"];
  answer: MDB_AnswerDTO["answer"];
  comment: MDB_AnswerDTO["comment"];
};

export type Visit = {
  uuid: MDB_VisitDTO["uuid"];
  visitId: MDB_VisitDTO["visit_name"];
  created: MDB_VisitDTO["created"];
  approvalState: MDB_VisitDTO["checked"];
  isPhantom: MDB_VisitDTO["is_phantom"];
  measurementDate: MDB_VisitDTO["date"];
  subject: Subject;
  project: Project;
  device: Device;
  heightCm: MDB_VisitDTO["height"];
  weightKg: MDB_VisitDTO["weight"];
  visualCorrectionDioptre: MDB_VisitDTO["visual_correction_dioptre"];
  answers: Answer[];
  finalizer: OperatorDTO;
  finalizationDate: MDB_VisitDTO["registration_finalize_date"];
  approver: OperatorDTO | null;
  approvalDate: MDB_VisitDTO["registration_approve_date"];
  signatureState: MDB_VisitDTO["registration_signature_status"];
  disapprovalReason: MDB_VisitDTO["registration_disapprove_reason"];
};

export type CreatedVisitData = Pick<Visit, "uuid" | "visitId">;

// TODO: correct the type
export type RecentVisitsTableVisit = Visit;

export type DuplicatedVisitIncludingQuestions = Omit<
  Visit,
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
  gender: GenderDTO;
  handedness: HandednessDTO;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

export type VisitDetailPDF = Pick<VisitPDF, "name" | "content">;

export type VisitDetail = Pick<Visit, "uuid" | "visitId" | "approvalState" | "isPhantom" | "signatureState"> & {
  pdf: VisitDetailPDF;
};
