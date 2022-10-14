import { Gender, SideDominance, VisualCorrection } from "../../../data/form_data";
import { AnswerOption, IQac } from "../../../data/visit_data";
import { Override } from "../../../util/utils";

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
  gender: Gender | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  sideDominance: SideDominance | null;
  visualCorrection: VisualCorrection | null;
  visualCorrectionValue: TextFieldNumberInput;
  email: string;
  phoneNumber: string;
  answers: FormAnswer[];
}
