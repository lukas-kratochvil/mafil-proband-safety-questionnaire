import { LanguageCode } from "@app/i18n";
import { AnswerOption } from "@app/model/form";

export interface IProjectDTO {
  id: string;
  acronym: string;
  name: string;
}

export interface IDeviceDTO {
  id: string;
  name: string;
}

export enum VisitState {
  PHANTOM_DONE = "PHANTOM_DONE",
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

export interface IVisitDTO {
  visit_name: string;
  date: Date; // TODO: not sure if this attribute is string or Date
  state: VisitState;
  is_phantom: boolean;
  proband_language_code: LanguageCode;
  project_id: string;
  device_id: string;
  measurement_date: Date; // TODO: not sure if this attribute is string or Date
  finalizer_uco: string;
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
}

export interface IVisitPdfDTO {
  file_content: string; // Base64 encoded PDF content
}
