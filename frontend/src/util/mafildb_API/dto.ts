import { AnswerOption } from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";

export interface IProjectDTO {
  uuid: string;
  acronym: string;
  name: string;
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

export enum VisitState {
  DISAPPROVED = "DISAPPROVED",
  APPROVED = "APPROVED",
  FOR_SIGNATURE_PHYSICALLY = "FOR_SIGNATURE_PHYSICALLY",
  FOR_SIGNATURE_ELECTRONICALLY = "FOR_SIGNATURE_ELECTRONICALLY",
  SIGNED_PHYSICALLY = "SIGNED_PHYSICALLY",
  SIGNED_ELECTRONICALLY = "SIGNED_ELECTRONICALLY",
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

export interface ICreateVisitInput {
  state: VisitState;
  is_phantom: boolean;
  date: Date;
  subject_uuid: string;
  project_uuid: string;
  device_id: number;
  height: number;
  weight: number;
  visual_correction_dioptre: number;
  registration_answers: IAnswerDTO[];
  registration_finalize_user: string;
  registration_finalize_date: Date;
  registration_approve_user: string | null;
  registration_approve_date: Date | null;
  registration_disapprove_reason: string;
};

export type IVisitDTO = Omit<
  ICreateVisitInput,
  "subject_uuid" | "project_uuid" | "device_id" | "registration_finalize_user" | "registration_approve_user"
> & {
  uuid: string;
  visit_name: string;
  created: Date;
  subject: ISubjectDTO;
  project: IProjectDTO;
  device: IDeviceDTO;
  registration_finalize_user: IRegistrationUserDTO;
  registration_approve_user: IRegistrationUserDTO | null;
};

export type IUpdateVisitStateInput = Pick<IVisitDTO, "visit_name" | "state">;

export type VisitFileType = "reg_form";

export type IAddPdfToVisitInput = {
  file_type: VisitFileType;
  name: string; // also contains extension, for example: my_doc.pdf
  mime_type: string;
  content: string; // Base64 encoded PDF content
};

export type IVisitFileDTO = IAddPdfToVisitInput & {
  id: number;
  uploaded: Date;
};
