import { updatedDiff } from "deep-object-diff";
import { OperatorDev } from "@app/hooks/auth/auth-dev";
import { AnswerOption, FormAnswer, FormPropType } from "@app/model/form";
import { IProjectDTO } from "@app/util/mafildb_API/dto";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "@app/util/server_API/dto";

export type GenderCode = "M" | "F" | "O";

export type HandednessCode = "r" | "l" | "rl" | "u";

export const compareGenders = (a: IGenderDTO, b: IGenderDTO, _locale: string): number => {
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

  const aText = a.translations.find((trans) => trans.language.code === locale)?.text || undefined;
  const bText = b.translations.find((trans) => trans.language.code === locale)?.text || undefined;
  return aText === undefined || bText === undefined ? -1 : new Intl.Collator(locale).compare(aText, bText);
};

export const compareHandednesses = (a: IHandednessDTO, b: IHandednessDTO, _locale: string): number => {
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
  submittedData: FormPropType
): Partial<FormPropType> => {
  if (initialData === undefined) {
    return submittedData;
  }

  const { answers: initialAnswers, ...initialDataRest } = initialData;
  const { answers: submittedAnswers, ...submittedDataRest } = submittedData;

  let diffAnswers: FormAnswer[] | undefined;
  const sortedInitialAnswers = initialAnswers.sort();
  const sortedSubmittedAnswers = submittedAnswers.sort();

  if (
    initialAnswers.length === submittedAnswers.length
    && sortedInitialAnswers.every((answer, i) => answer.questionId === sortedSubmittedAnswers[i].questionId)
  ) {
    diffAnswers = sortedInitialAnswers.filter(
      (answer, i) =>
        answer.answer !== sortedSubmittedAnswers[i].answer || answer.comment !== sortedSubmittedAnswers[i].comment
    );
  }

  const diffRest = updatedDiff(initialDataRest, submittedDataRest);
  return { ...diffRest, answers: diffAnswers || submittedAnswers };
};

export const isVisitFormForApproval = (operator: OperatorDev, data: FormPropType) =>
  operator === undefined
  || (operator.role !== "MR_HIGH_PERM"
    && data.answers.some((answer) => answer.mustBeApproved && answer.answer === AnswerOption.YES));
