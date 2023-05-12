import { updatedDiff } from "deep-object-diff";
import { Operator } from "@app/hooks/auth/AuthProvider";
import { AnswerOption, FormPropType, ValidatedFormAnswer, ValidatedFormData } from "@app/model/form";
import { IProjectDTO } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "@app/util/server_API/dto";
import { IButtonProps } from "@app/util/utils";

export interface IFormSubmitButtonProps extends Omit<IButtonProps, "onClick"> {
  onClick: (data: ValidatedFormData) => Promise<void>;
}

export type GenderCode = "M" | "F" | "O";

type HandednessCode = "r" | "l" | "rl" | "u";

export const compareGenders = (a: IGenderDTO, b: IGenderDTO): number => {
  const aCode = a.code as GenderCode;
  const bCode = b.code as GenderCode;
  return aCode === "M" || (aCode === "F" && bCode !== "M") ? -1 : 1;
};

export const compareNativeLanguages = (a: INativeLanguageDTO, b: INativeLanguageDTO, locale: string): number => {
  if (a.order && b.order) {
    return a.order - b.order;
  }
  if (a.order) {
    return -1;
  }
  if (b.order) {
    return 1;
  }

  const aText = a.translations.find((trans) => trans.language.code === locale)?.text ?? undefined;
  const bText = b.translations.find((trans) => trans.language.code === locale)?.text ?? undefined;
  return aText === undefined || bText === undefined ? -1 : new Intl.Collator(locale).compare(aText, bText);
};

export const compareHandednesses = (a: IHandednessDTO, b: IHandednessDTO): number => {
  const aCode = a.code as HandednessCode;
  const bCode = b.code as HandednessCode;

  if (aCode === "r") {
    return -1;
  }
  if (bCode === "r") {
    return 1;
  }
  return aCode === "l" || (aCode === "rl" && bCode !== "l") ? -1 : 1;
};

export const getProjectText = (project: IProjectDTO): string => {
  const projectAcronym = project.acronym.trim();
  const projectName = project.name.trim();
  return projectName === "" ? projectAcronym : `${projectAcronym} - ${projectName}`;
};

export const getModifiedFieldsOnly = (
  initialData: FormPropType | undefined,
  submittedData: ValidatedFormData
): Partial<ValidatedFormData> | undefined => {
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
    initialAnswers.length === submittedAnswers.length
    && sortedInitialAnswers.every((answer, i) => answer.questionId === sortedSubmittedAnswers[i].questionId)
  ) {
    diffAnswers = sortedSubmittedAnswers.filter(
      (answer, i) =>
        answer.answer !== sortedInitialAnswers[i].answer || answer.comment !== sortedInitialAnswers[i].comment
    );
  }

  const diffRest: Partial<ValidatedFormData> = updatedDiff(initialDataRest, submittedDataRest);
  return { ...diffRest, answers: diffAnswers };
};

export const getValidatedFormData = (data: FormPropType): ValidatedFormData => ({
  project: data.project,
  device: data.device,
  measuredAt: data.measuredAt,
  name: data.name,
  surname: data.surname,
  personalId: data.personalId,
  birthdate: data.birthdate as Date,
  gender: data.gender as IGenderDTO,
  nativeLanguage: data.nativeLanguage as INativeLanguageDTO,
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
  disapprovalReason: data.disapprovalReason ?? "",
});

export const isVisitFormForApproval = (operator: Operator, data: ValidatedFormData) =>
  operator === undefined
  || (operator.role !== "MR_HIGH_PERM"
    && data.answers.some((answer) => answer.mustBeApproved && answer.answer === AnswerOption.YES));
