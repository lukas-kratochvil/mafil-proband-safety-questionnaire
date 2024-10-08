import { updatedDiff } from "deep-object-diff";
import type { Auth } from "@app/hooks/auth/auth";
import type { Device } from "@app/model/device";
import type {
  AnswerOption,
  FormPropType,
  ValidatedFormAnswer,
  ValidatedOperatorFormData,
  ValidatedProbandFormData,
} from "@app/model/form";
import type { NativeLanguage } from "@app/model/language";
import type { Project } from "@app/model/project";
import type { GenderDTO, HandednessDTO } from "@app/util/server_API/dto";

/**
 * Returns a partial object of modified fields only.
 */
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
  const sortedInitialAnswers = initialAnswers.toSorted();
  const sortedSubmittedAnswers = submittedAnswers.toSorted();

  if (
    sortedInitialAnswers.length === sortedSubmittedAnswers.length
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

/**
 * Returns proband's form data in a correct format.
 */
export const getValidatedProbandFormData = (data: FormPropType): ValidatedProbandFormData => ({
  name: data.name,
  surname: data.surname,
  personalId: data.personalId,
  birthdate: data.birthdate as Date,
  gender: data.gender as GenderDTO,
  nativeLanguage: data.nativeLanguage as NativeLanguage,
  heightCm: typeof data.heightCm === "string" ? +data.heightCm : data.heightCm,
  weightKg: typeof data.weightKg === "string" ? +data.weightKg : data.weightKg,
  handedness: data.handedness as HandednessDTO,
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

/**
 * Returns operator's form data in a correct format.
 */
export const getValidatedOperatorFormData = (data: FormPropType): ValidatedOperatorFormData => ({
  ...getValidatedProbandFormData(data),
  project: data.project as Project,
  device: data.device as Device,
  measuredAt: data.measuredAt as Date,
  disapprovalReason: data.disapprovalReason,
});

/**
 * Decides whether the visit must be approved by an operator with higher permissions.
 */
export const isVisitFormForApproval = (operator: Auth["operator"], data: ValidatedOperatorFormData) =>
  operator === undefined
  || (operator.role !== "MR_HIGH_PERM" && data.answers.some((answer) => answer.mustBeApproved && answer.answer === "YES"));
