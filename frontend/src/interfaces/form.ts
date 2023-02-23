import { IOption } from "@app/components/form/util/options";
import { Override } from "@app/util/utils";
import { AnswerOption, IQac } from "./visit";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export type FormAnswer = Override<IQac, { answer: AnswerOption | null }>;

export type FormQac = FormAnswer & { index: number };

export interface FormPropType {
  // Project info
  project: string | null;
  device: string | null;
  measurementDate: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: IOption | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  handedness: IOption | null;
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
