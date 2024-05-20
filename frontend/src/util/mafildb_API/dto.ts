import type { AnswerOption } from "@app/model/form";
import type { ProbandVisitLanguageCode } from "@app/model/visit";
import type { ObjectValues } from "../utils";

export type MDB_LanguageDTO = {
  code: string;
  name: string;
  name_cs: string;
  name_en: string;
  priority: number | null;
};

export type MDB_ProjectDTO = {
  uuid: string;
  name: string;
  acronym: string;
};

export type MDB_DeviceDTO = {
  id: number;
  name: string;
};

export type MDB_GenderCode = "ns" | "m" | "f" | "o";
export type MDB_HandednessCode = "ns" | "rh" | "lh" | "fl" | "un";

export type MDB_CreateSubjectInput = {
  preferred_language_code: ProbandVisitLanguageCode;
  first_name: string;
  last_name: string;
  birth_date: string;
  personal_ID: string;
  gender: MDB_GenderCode;
  native_language_code: string;
  handedness: MDB_HandednessCode;
  email: string;
  phone: string;
};

export type MDB_SubjectDTO = Omit<MDB_CreateSubjectInput, "birth_date"> & {
  uuid: string;
  birth_date: Date;
};

export const MDB_ApprovalState = {
  APPROVED: "ra",
  DISAPPROVED: "rd",
} as const;

type MDB_ApprovalState = ObjectValues<typeof MDB_ApprovalState>;

export type MDB_AnswerDTO = {
  question_id: string;
  answer: AnswerOption;
  comment: string;
};

export type MDB_CreateVisitInput = {
  checked: MDB_ApprovalState;
  is_phantom: boolean;
  date: string;
  subject_uuid: string;
  project_uuid: string;
  device_id: number;
  height: number;
  weight: number;
  visual_correction_dioptre: number;
  registration_answers: MDB_AnswerDTO[];
  registration_finalize_username: string;
  registration_finalize_date: Date;
  registration_approve_username: string;
  registration_approve_date: Date | null;
  registration_disapprove_reason: string;
};

type MDB_RegistrationUserDTO = {
  id: number;
  username: string;
};

export const MDB_SignatureState = {
  NOT_SET: "ns",
  FOR_SIGNATURE_PHYSICALLY: "pp",
  FOR_SIGNATURE_ELECTRONICALLY: "pe",
  SIGNED_PHYSICALLY: "sp",
  SIGNED_ELECTRONICALLY: "se",
} as const;

type MDB_SignatureState = ObjectValues<typeof MDB_SignatureState>;

export type MDB_VisitDTO = Omit<
  MDB_CreateVisitInput,
  | "date"
  | "subject_uuid"
  | "project_uuid"
  | "device_id"
  | "registration_finalize_username"
  | "registration_approve_username"
> & {
  uuid: string;
  visit_name: string;
  created: Date;
  subject: MDB_SubjectDTO;
  project: MDB_ProjectDTO;
  date: Date;
  device: MDB_DeviceDTO | null;
  registration_finalize_user: MDB_RegistrationUserDTO | null;
  registration_approve_user: MDB_RegistrationUserDTO | null;
  registration_signature_status: MDB_SignatureState;
};

export type MDB_UpdateVisitSignatureStateInput = Pick<MDB_VisitDTO, "registration_signature_status">;

export type MDB_VisitFileType = "reg_form";

type MDB_VisitFileMimeType = "application/pdf";

export type MDB_AddPdfToVisitInput = {
  file_type: MDB_VisitFileType;
  name: string; // also contains extension, for example: my_doc.pdf
  mime_type: MDB_VisitFileMimeType;
  content: string; // Base64 encoded PDF content
};

export type MDB_VisitFileDTO = MDB_AddPdfToVisitInput & {
  id: number;
  uploaded: Date;
};
