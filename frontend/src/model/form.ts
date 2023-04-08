import { IOption } from "@app/components/form/util/options";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "../util/server_API/dto";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export enum QuestionPartNumber {
  ONE = 1,
  TWO = 2,
}

export enum AnswerOption {
  YES = "YES",
  NO = "NO",
}

export type FormAnswer = {
  questionId: string;
  partNumber: QuestionPartNumber;
  answer: AnswerOption | null;
  comment: string;
};

export type FormQac = FormAnswer & { index: number };

export type FormPropType = {
  // Project info
  project: IProjectDTO | null;
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

  // Visit-form approval
  disapprovalReason: string | null;
};
