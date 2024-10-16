import type { StrictOmit } from "@app/types";
import type { MDB_AnswerDTO, MDB_VisitDTO } from "@app/util/mafildb_API/dto";
import type { GenderDTO, HandednessDTO, OperatorDTO, VisitFormAnswerIncludingQuestion } from "@app/util/server_API/dto";
import type { Device } from "./device";
import type { Project } from "./project";
import type {
  DuplicatedPhantomVisitSubject,
  DuplicatedProbandVisitSubject,
  RecentVisitSubject,
  Subject,
} from "./subject";
import type { VisitPDF } from "./visitPdf";

export type Answer = {
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
  deviceId: MDB_VisitDTO["registration_device"];
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

export type RecentVisitsTableVisit = StrictOmit<Visit, "deviceId" | "finalizer" | "subject"> & {
  device: Device | null;
  finalizer: Visit["finalizer"] | null;
  subject: RecentVisitSubject;
};

type DuplicatedVisitBase = StrictOmit<
  Visit,
  | "created"
  | "approvalState"
  | "signatureState"
  | "subject"
  | "answers"
  | "finalizer"
  | "finalizationDate"
  | "approver"
  | "approvalDate"
  | "disapprovalReason"
> & {
  gender: GenderDTO;
  handedness: HandednessDTO;
  subject: Subject;
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[];
};

export type DuplicatedProbandVisit = StrictOmit<DuplicatedVisitBase, "subject"> & {
  subject: DuplicatedProbandVisitSubject;
};

// TODO: DuplicatedPhantomVisit shouldn't have `answersIncludingQuestions` attribute
export type DuplicatedPhantomVisit = StrictOmit<DuplicatedVisitBase, "subject"> & {
  subject: DuplicatedPhantomVisitSubject;
};

export type VisitDetailPDF = Pick<VisitPDF, "name" | "content">;

export type VisitDetail = Pick<Visit, "uuid" | "visitId" | "approvalState" | "isPhantom" | "signatureState"> & {
  pdf: VisitDetailPDF;
};
