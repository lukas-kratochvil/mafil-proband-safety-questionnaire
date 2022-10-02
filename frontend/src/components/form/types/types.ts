import { IQac } from "../../../data/visit_data";

export enum FormEditState {
  USER_EDIT,
  FANTOM,
  OPERATOR_CHECK,
  OPERATOR_EDIT,
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
