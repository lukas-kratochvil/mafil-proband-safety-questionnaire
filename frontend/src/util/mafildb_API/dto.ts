import { AnswerOption } from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";

export interface IProjectDTO {
  uuid: string;
  name: string;
  acronym: string;
}

export interface IDeviceDTO {
  id: number;
  name: string;
}

export interface ICreateSubjectInput {
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

export interface ISubjectDTO extends ICreateSubjectInput {
  uuid: string;
}

interface IRegistrationUserDTO {
  id: number;
  username: string;
}

interface IAnswerDTO {
  question_id: string;
  answer: AnswerOption;
  comment: string;
}

export enum ApprovalState {
  APPROVED = "ra",
  DISAPPROVED = "rd",
}

export enum SignatureState {
  NOT_SET = "ns",
  FOR_SIGNATURE_PHYSICALLY = "pp",
  FOR_SIGNATURE_ELECTRONICALLY = "pe",
  SIGNED_PHYSICALLY = "sp",
  SIGNED_ELECTRONICALLY = "se",
}

export type ICreateVisitInput = {
  checked: ApprovalState;
  is_phantom: boolean;
  date: Date;
  subject_uuid: string;
  project_uuid: string;
  device_id: number;
  height: number;
  weight: number;
  visual_correction_dioptre: number;
  registration_answers: IAnswerDTO[];
  registration_finalize_username: string;
  registration_finalize_date: Date;
  registration_approve_username: string;
  registration_approve_date: Date | null;
  registration_disapprove_reason: string;
};

export type IVisitDTO = Omit<
  ICreateVisitInput,
  "subject_uuid" | "project_uuid" | "device_id" | "registration_finalize_username" | "registration_approve_username"
> & {
  uuid: string;
  visit_name: string;
  created: Date;
  subject: ISubjectDTO;
  project: IProjectDTO;
  device: IDeviceDTO;
  registration_finalize_user: IRegistrationUserDTO;
  registration_approve_user: IRegistrationUserDTO | null;
  registration_signature_status: SignatureState;
};

export type IUpdateVisitSignatureStateInput = Pick<IVisitDTO, "visit_name" | "registration_signature_status">;

export type VisitFileType = "reg_form";

export type VisitFileMimeType = "application/pdf";

export type IAddPdfToVisitInput = {
  file_type: VisitFileType;
  name: string; // also contains extension, for example: my_doc.pdf
  mime_type: VisitFileMimeType;
  content: string; // Base64 encoded PDF content
};

export type IVisitFileDTO = IAddPdfToVisitInput & {
  id: number;
  uploaded: Date;
};
