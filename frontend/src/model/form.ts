import type { IOption, VisualCorrection } from "@app/components/form/util/options";
import type { ObjectValues } from "@app/util/utils";
import type { IGenderDTO, IHandednessDTO, QuestionHiddenByGendersWithoutId } from "../util/server_API/dto";
import type { IDevice } from "./device";
import type { INativeLanguage } from "./language";
import type { IProject } from "./project";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export const answerOptions = {
  yes: "yes",
  no: "no",
} as const;

export type AnswerOption = ObjectValues<typeof answerOptions>;

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
  device: IDevice | null;
  measuredAt: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: IGenderDTO | null;
  nativeLanguage: INativeLanguage | null;
  heightCm: TextFieldNumberInput;
  weightKg: TextFieldNumberInput;
  handedness: IHandednessDTO | null;
  visualCorrection: IOption<VisualCorrection> | null;
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

export type ValidatedProbandFormData = {
  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguage;
  heightCm: number;
  weightKg: number;
  handedness: IHandednessDTO;
  visualCorrectionDioptre: number;

  // Safety questions
  answers: ValidatedFormAnswer[];

  // Proband contacts
  email: string;
  phone: string;
};

type OperatorAddedFormData = {
  // Project info
  project: IProject;
  device: IDevice;
  measuredAt: Date;

  // Visit form disapproval
  disapprovalReason: string;
};

export type ValidatedOperatorModifiedFormData = OperatorAddedFormData & Partial<ValidatedProbandFormData>;

export type ValidatedOperatorFormData = OperatorAddedFormData & ValidatedProbandFormData;
