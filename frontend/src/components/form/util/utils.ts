import { type FilterOptionsState } from "@mui/material";
import { updatedDiff } from "deep-object-diff";
import { type Operator } from "@app/hooks/auth/AuthProvider";
import type { IDevice } from "@app/model/device";
import {
  AnswerOption,
  type FormPropType,
  type ValidatedFormAnswer,
  type ValidatedOperatorFormData,
  type ValidatedProbandFormData,
} from "@app/model/form";
import type { INativeLanguage } from "@app/model/language";
import type { IProject } from "@app/model/project";
import type { IGenderDTO, IHandednessDTO } from "@app/util/server_API/dto";

export const compareNativeLanguages = (a: INativeLanguage, b: INativeLanguage): number => {
  if (a.priority && b.priority) {
    return a.priority - b.priority;
  }
  if (a.priority) {
    return -1;
  }
  if (b.priority) {
    return 1;
  }
  return a.nameEn.localeCompare(b.nameEn);
};

export const filterNativeLanguages = (options: INativeLanguage[], state: FilterOptionsState<INativeLanguage>) => {
  const inputValue = state.inputValue.trim().toLowerCase();
  return options.filter((option) => {
    const valuesToBeMatched = [option.nativeName, option.nameCs, option.nameEn];
    return valuesToBeMatched.some((optionValue) => optionValue.trim().toLowerCase().startsWith(inputValue));
  });
};

export const getProjectText = (project: IProject): string => {
  const projectAcronym = project.acronym.trim();
  const projectName = project.name.trim();
  return projectName === "" ? projectAcronym : `${projectAcronym} - ${projectName}`;
};

export const getModifiedFieldsOnly = (
  initialData: FormPropType | undefined,
  submittedData: ValidatedOperatorFormData
): Partial<ValidatedOperatorFormData> | undefined => {
  if (initialData === undefined) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { answers: initialAnswers, visualCorrection, ...initialDataRest } = initialData;
  const { answers: submittedAnswers, ...submittedDataRest } = submittedData;

  let diffAnswers: ValidatedFormAnswer[] | undefined;
  const sortedInitialAnswers = initialAnswers.sort();
  const sortedSubmittedAnswers = submittedAnswers.sort();

  if (
    sortedInitialAnswers.length === submittedAnswers.length
    && sortedInitialAnswers.every((answer, i) => answer.questionId === sortedSubmittedAnswers[i]?.questionId)
  ) {
    diffAnswers = sortedSubmittedAnswers.filter(
      (answer, i) =>
        answer.answer !== sortedInitialAnswers[i]?.answer || answer.comment !== sortedInitialAnswers[i]?.comment
    );
  }

  const diffRest: Partial<ValidatedOperatorFormData> = updatedDiff(initialDataRest, submittedDataRest);
  return { ...diffRest, answers: diffAnswers };
};

export const getValidatedProbandFormData = (data: FormPropType): ValidatedProbandFormData => ({
  name: data.name,
  surname: data.surname,
  personalId: data.personalId,
  birthdate: data.birthdate as Date,
  gender: data.gender as IGenderDTO,
  nativeLanguage: data.nativeLanguage as INativeLanguage,
  heightCm: typeof data.heightCm === "string" ? +data.heightCm : data.heightCm,
  weightKg: typeof data.weightKg === "string" ? +data.weightKg : data.weightKg,
  handedness: data.handedness as IHandednessDTO,
  visualCorrectionDioptre:
    typeof data.visualCorrectionDioptre === "string" ? +data.visualCorrectionDioptre : data.visualCorrectionDioptre,
  answers: data.answers.map((answer) => ({
    questionId: answer.questionId,
    mustBeApproved: answer.mustBeApproved,
    answer: answer.answer as AnswerOption,
    comment: answer.comment,
  })),
  email: data.email,
  phone: data.phone,
});

export const getValidatedOperatorFormData = (data: FormPropType): ValidatedOperatorFormData => ({
  ...getValidatedProbandFormData(data),
  project: data.project as IProject,
  device: data.device as IDevice,
  measuredAt: data.measuredAt as Date,
  disapprovalReason: data.disapprovalReason as string,
});

export const isVisitFormForApproval = (operator: Operator, data: ValidatedOperatorFormData) =>
  operator === undefined
  || (operator.role !== "MR_HIGH_PERM"
    && data.answers.some((answer) => answer.mustBeApproved && answer.answer === AnswerOption.YES));
