import type { AnswerOption } from "@app/model/form";
import type { ProbandVisitLanguageCode } from "@app/model/visit";
import type { ObjectValues } from "../utils";

export type MDB_ILanguageDTO = {
  code: string;
  name: string;
  name_cs: string;
  name_en: string;
  priority: number | null;
};

export type MDB_IProjectDTO = {
  uuid: string;
  name: string;
  acronym: string;
};

export type MDB_IDeviceDTO = {
  id: number;
  name: string;
};

export type MDB_GenderCode = "ns" | "m" | "f" | "o";
export type MDB_HandednessCode = "ns" | "rh" | "lh" | "fl" | "un";

export type MDB_ICreateSubjectInput = {
  preferred_language_code: ProbandVisitLanguageCode;
  first_name: string;
  last_name: string;
  birth_date: Date;
  personal_ID: string;
  gender: MDB_GenderCode;
  native_language_code: string;
  handedness: MDB_HandednessCode;
  email: string;
  phone: string;
};

export type MDB_ISubjectDTO = MDB_ICreateSubjectInput & {
  uuid: string;
};

export const MDB_ApprovalState = {
  APPROVED: "ra",
  DISAPPROVED: "rd",
} as const;

type MDB_ApprovalState = ObjectValues<typeof MDB_ApprovalState>;

type MDB_IAnswerDTO = {
  question_id: string;
  answer: AnswerOption;
  comment: string;
};

// TODO: check for nullable fields against the MAFILDB model: https://github.com/lukas-kratochvil/mafil-proband-safety-questionnaire/issues/19
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

type MDB_IRegistrationUserDTO = {
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

export type MDB_IVisitDTO = Omit<
  MDB_ICreateVisitInput,
  "subject_uuid" | "project_uuid" | "device_id" | "registration_finalize_username" | "registration_approve_username"
> & {
  uuid: string;
  visit_name: string;
  created: Date;
  subject: MDB_ISubjectDTO;
  // TODO: only 'uuid' and 'acronym' properties - missing 'name' attribute
  project: MDB_IProjectDTO;
  // TODO: only 'id' and 'type' properties - missing 'name' attribute
  // TODO: could any device ever be null in the devel/prod env?
  device: MDB_IDeviceDTO;
  registration_finalize_user: MDB_IRegistrationUserDTO;
  registration_approve_user: MDB_IRegistrationUserDTO | null;
  // TODO: create type for one of: “ns” | ”pp” | ”pe” | ”sp” | ”se”
  registration_signature_status: MDB_SignatureState;
};

export type MDB_IUpdateVisitSignatureStateInput = Pick<MDB_IVisitDTO, "registration_signature_status">;

export type MDB_VisitFileType = "reg_form";

type MDB_VisitFileMimeType = "application/pdf";

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
