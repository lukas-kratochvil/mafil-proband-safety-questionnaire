import { Gender, SideDominance, VisualCorrection } from "../../../data/form_data";
import { IQac } from "../../../data/visit_data";

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
  gender: Gender | null;
  nativeLanguage: string | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  sideDominance: SideDominance | null;
  visualCorrection: VisualCorrection | null;
  visualCorrectionValue: TextFieldNumberInput;
  email: string;
  phoneNumber: string;
  answers: IQac[];
}
