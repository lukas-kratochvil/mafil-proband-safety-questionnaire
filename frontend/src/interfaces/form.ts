import { IOption } from "@app/components/form/util/options";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { Override } from "@app/util/utils";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "../util/server_API/dto";
import { AnswerOption, IQac } from "./visit";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export type FormAnswer = Override<IQac, { answer: AnswerOption | null }>;

export type FormQac = FormAnswer & { index: number };

export interface FormPropType {
  // Project info
  project: IProjectDTO | null;
  device: IDeviceDTO | null;
  measurementDate: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: IGenderDTO | null;
  nativeLanguage: INativeLanguageDTO | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  handedness: IHandednessDTO | null;
  visualCorrection: IOption | null;
  visualCorrectionValue: TextFieldNumberInput;

  // Safety questions
  answers: FormAnswer[];

  // Proband contacts
  email: string;
  phone: string;

  // Visit-form approval
  disapprovalReason: string | null;
}
