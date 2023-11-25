import { AnswerOption } from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";

export interface IProjectDTO {
  uuid: string;
  acronym: string;
  name: string;
}

export interface IDeviceDTO {
  id: string;
  name: string;
}

export enum VisitState {
  DISAPPROVED = "DISAPPROVED",
  APPROVED = "APPROVED",
  FOR_SIGNATURE_PHYSICALLY = "FOR_SIGNATURE_PHYSICALLY",
  FOR_SIGNATURE_ELECTRONICALLY = "FOR_SIGNATURE_ELECTRONICALLY",
  SIGNED_PHYSICALLY = "SIGNED_PHYSICALLY",
  SIGNED_ELECTRONICALLY = "SIGNED_ELECTRONICALLY",
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
  project_uuid: string;
  device_id: string;
  name: string;
  surname: string;
  preferred_language_id: ProbandVisitLanguageCode;
  personal_id: string;
  birthdate: Date;
  gender_code: string;
  native_language_code: string;
  height: number;
  weight: number;
  handedness_code: string;
  visual_correction_dioptre: number;
  email: string;
  phone: string;
  answers: IAnswerDTO[];
  finalizer_username: string;
  finalization_date: Date;
  approver_username?: string;
  approval_date?: Date;
  disapproval_reason?: string;
}

export interface IVisitDTO
  extends Omit<ICreateVisitInput, "finalization_date" | "approver_username" | "approval_date" | "disapproval_reason"> {
  visit_name: string;
  created: Date;
}

export type IUpdateVisitStateInput = Pick<IVisitDTO, "visit_name" | "state">;

export type IAddPdfToVisitInput = {
  file_type: string;
  name: string; // also contains extension, for example: my_doc.pdf
  mime_type: string;
  content: string; // Base64 encoded PDF content
};

export type IVisitFileDTO = IAddPdfToVisitInput & {
  id: number;
  uploaded: Date;
};
