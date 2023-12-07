import { IOption } from "@app/components/form/util/options";
import { IDeviceDTO } from "@app/util/mafildb_API/dto";
import {
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  QuestionHiddenByGendersWithoutId,
} from "../util/server_API/dto";
import { IProject } from "./project";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export enum AnswerOption {
  YES = "YES",
  NO = "NO",
}

export type FormAnswer = {
  questionId: string;
  mustBeApproved: boolean;
  answer: AnswerOption | null;
  comment: string;
};

// QAC entity is grouping Question, Answer and Comment together
export type FormQac = FormAnswer &
  Omit<QuestionHiddenByGendersWithoutId, "mustBeApproved"> & {
    index: number; // 'index' is important to index specific question in the react-hook-form values
  };

export type FormPropType = {
  // Project info
  project: IProject | null;
  device: IDeviceDTO | null;
  measuredAt: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: IGenderDTO | null;
  nativeLanguage: INativeLanguageDTO | null;
  heightCm: TextFieldNumberInput;
  weightKg: TextFieldNumberInput;
  handedness: IHandednessDTO | null;
  visualCorrection: IOption | null;
  visualCorrectionDioptre: TextFieldNumberInput;

  // Safety questions
  answers: FormAnswer[];

  // Proband contacts
  email: string;
  phone: string;

  // Visit form disapproval
  disapprovalReason: string | null;
};

export type ValidatedFormAnswer = {
  questionId: string;
  mustBeApproved: boolean;
  answer: AnswerOption;
  comment: string;
};

export type ValidatedFormData = {
  // Project info
  project: IProject | null;
  device: IDeviceDTO | null;
  measuredAt: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  heightCm: number;
  weightKg: number;
  handedness: IHandednessDTO;
  visualCorrectionDioptre: number;

  // Safety questions
  answers: ValidatedFormAnswer[];

  // Proband contacts
  email: string;
  phone: string;

  // Visit form disapproval
  disapprovalReason: string;
};
