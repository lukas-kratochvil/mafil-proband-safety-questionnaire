import { AnswerOption } from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";

export interface MDB_IProjectDTO {
  uuid: string;
  name: string;
  acronym: string;
}

export interface MDB_IDeviceDTO {
  id: number;
  name: string;
}

export interface MDB_ICreateSubjectInput {
  preferred_language_id: ProbandVisitLanguageCode;
  first_name: string;
  last_name: string;
  birth_date: Date;
  personal_ID: string;
  gender: string;
  native_language_id: string;
  handedness: string;
  email: string;
  phone: string;
}

export interface MDB_ISubjectDTO extends MDB_ICreateSubjectInput {
  uuid: string;
}

interface MDB_IRegistrationUserDTO {
  id: number;
  username: string;
}

interface MDB_IAnswerDTO {
  question_id: string;
  answer: AnswerOption;
  comment: string;
}

export enum MDB_ApprovalState {
  APPROVED = "ra",
  DISAPPROVED = "rd",
}

export enum MDB_SignatureState {
  NOT_SET = "ns",
  FOR_SIGNATURE_PHYSICALLY = "pp",
  FOR_SIGNATURE_ELECTRONICALLY = "pe",
  SIGNED_PHYSICALLY = "sp",
  SIGNED_ELECTRONICALLY = "se",
}

export type MDB_ICreateVisitInput = {
  checked: MDB_ApprovalState;
  is_phantom: boolean;
  date: Date;
  subject_uuid: string;
  project_uuid: string;
  device_id: number;
  height: number;
  weight: number;
  visual_correction_dioptre: number;
  registration_answers: MDB_IAnswerDTO[];
  registration_finalize_username: string;
  registration_finalize_date: Date;
  registration_approve_username: string;
  registration_approve_date: Date | null;
  registration_disapprove_reason: string;
};

export type MDB_IVisitDTO = Omit<
  MDB_ICreateVisitInput,
  "subject_uuid" | "project_uuid" | "device_id" | "registration_finalize_username" | "registration_approve_username"
> & {
  uuid: string;
  visit_name: string;
  created: Date;
  subject: MDB_ISubjectDTO;
  project: MDB_IProjectDTO;
  device: MDB_IDeviceDTO;
  registration_finalize_user: MDB_IRegistrationUserDTO;
  registration_approve_user: MDB_IRegistrationUserDTO | null;
  registration_signature_status: MDB_SignatureState;
};

export type MDB_IUpdateVisitSignatureStateInput = Pick<MDB_IVisitDTO, "registration_signature_status">;

export type MDB_VisitFileType = "reg_form";

export type MDB_VisitFileMimeType = "application/pdf";

export type MDB_IAddPdfToVisitInput = {
  file_type: MDB_VisitFileType;
  name: string; // also contains extension, for example: my_doc.pdf
  mime_type: MDB_VisitFileMimeType;
  content: string; // Base64 encoded PDF content
};

export type MDB_IVisitFileDTO = MDB_IAddPdfToVisitInput & {
  id: number;
  uploaded: Date;
};
