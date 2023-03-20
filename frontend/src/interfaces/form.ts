import { IOption } from "@app/components/form/util/options";
import { IDeviceEntity, IProjectEntity } from "@app/util/mafildb_API/dto";
import { Override } from "@app/util/utils";
import { ITranslatedEntity } from "../util/server_API/dto";
import { AnswerOption, IQac } from "./visit";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export type FormAnswer = Override<IQac, { answer: AnswerOption | null }>;

export type FormQac = FormAnswer & { index: number };

export interface FormPropType {
  // Project info
  project: IProjectEntity | null;
  device: IDeviceEntity | null;
  measurementDate: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: ITranslatedEntity | null;
  nativeLanguage: ITranslatedEntity | null;
  height: TextFieldNumberInput;
  weight: TextFieldNumberInput;
  handedness: ITranslatedEntity | null;
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
