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
  proband_language_code: ProbandVisitLanguageCode;
  project_uuid: string;
  device_id: string;
  measurement_date: Date; // TODO: not sure if this attribute is string or Date
  name: string;
  surname: string;
  personal_id: string;
  birthdate: Date; // TODO: not sure if this attribute is string or Date
  gender_code: string;
  native_language_code: string;
  height_cm: number;
  weight_kg: number;
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
  date: Date; // TODO: not sure if this attribute is string or Date
  created: Date; // TODO: not sure if this attribute is string or Date
}

export type IUpdateVisitStateInput = Pick<IVisitDTO, "visit_name" | "state">;

type IVisitFileType = "REGISTRATION_PDF";

export type IAddPdfToVisitInput = Pick<IVisitDTO, "visit_name"> & {
  file_type: IVisitFileType;
  file_name: string;
  file_extension: string;
  file_content: string; // Base64 encoded PDF content
};

export type IVisitPdfDTO = Pick<IAddPdfToVisitInput, "file_name" | "file_content">;
