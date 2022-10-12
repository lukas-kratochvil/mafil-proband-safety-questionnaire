import { IQac } from "../../../data/visit_data";

export enum UserFormContext {
  OPERATOR_APPROVE_DISABLED,
  OPERATOR_APPROVE,
  OPERATOR_CHECK,
  OPERATOR_EDIT,
}

export interface IFormInputsProps {
  disableInputs?: boolean;
}

export interface IFantomFormInputsProps extends IFormInputsProps {
  isFantom?: boolean;
}

type TextFieldNumberInput = string | number;

export interface FormPropType {
  project: string | null;
  device: string | null;
  measurementDate: Date | null;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: string | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  sideDominance: string | null;
  visualCorrection: string | null;
  visualCorrectionValue: TextFieldNumberInput;
  email: string;
  phoneNumber: string;
  answers: IQac[];
}
