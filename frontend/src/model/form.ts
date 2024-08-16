import type { AutocompleteOption, VisualCorrection } from "@app/components/form/util/options";
import type { ObjectValuesUnion } from "@app/types";
import type { GenderDTO, HandednessDTO, QuestionHiddenByGendersWithoutId } from "../util/server_API/dto";
import type { Device } from "./device";
import type { NativeLanguage } from "./language";
import type { Project } from "./project";

// Form fields having this data type are validated as numbers
type TextFieldNumberInput = string | number;

export const answerOptions = {
  yes: "YES",
  no: "NO",
} as const;

export type AnswerOption = ObjectValuesUnion<typeof answerOptions>;

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
  project: Project | null;
  device: Device | null;
  measuredAt: Date | null;

  // Proband info
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date | null;
  gender: GenderDTO | null;
  nativeLanguage: NativeLanguage | null;
  heightCm: TextFieldNumberInput;
  weightKg: TextFieldNumberInput;
  handedness: HandednessDTO | null;
  visualCorrection: AutocompleteOption<VisualCorrection> | null;
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
  gender: GenderDTO;
  nativeLanguage: NativeLanguage;
  heightCm: number;
  weightKg: number;
  handedness: HandednessDTO;
  visualCorrectionDioptre: number;

  // Safety questions
  answers: ValidatedFormAnswer[];

  // Proband contacts
  email: string;
  phone: string;
};

type OperatorAddedFormData = {
  // Project info
  project: Project;
  device: Device;
  measuredAt: Date;

  // Visit form disapproval reason - null if not disapproved
  disapprovalReason: string | null;
};

export type ValidatedOperatorModifiedFormData = OperatorAddedFormData & Partial<ValidatedProbandFormData>;

export type ValidatedOperatorFormData = OperatorAddedFormData & ValidatedProbandFormData;
