import { AnswerOption, IQac } from "../../../data/visit_data";
import { Override } from "../../../util/utils";
import { IOption } from "./options";

export interface IFormInputsProps {
  disableInputs?: boolean;
}

export interface IFantomFormInputsProps extends IFormInputsProps {
  isFantom?: boolean;
}

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export type FormAnswer = Override<IQac, { answer: AnswerOption | null }>;

export interface FormPropType {
  project: string | null;
  device: string | null;
  measurementDate: Date | null;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: IOption | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  sideDominance: IOption | null;
  visualCorrection: IOption | null;
  visualCorrectionValue: TextFieldNumberInput;
  email: string;
  phoneNumber: string;
  answers: FormAnswer[];
}
