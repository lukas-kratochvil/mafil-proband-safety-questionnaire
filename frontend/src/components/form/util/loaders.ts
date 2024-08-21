import type { FormAnswer, FormPropType } from "@app/model/form";
import type { DuplicatedPhantomVisit, DuplicatedProbandVisit } from "@app/model/visit";
import type {
  ApprovalRoomVisitFormIncludingQuestionsDTO,
  VisitFormAnswerIncludingQuestion,
  WaitingRoomVisitFormIncludingQuestions,
} from "@app/util/server_API/dto";
import { getAutocompleteOption, visualCorrectionOptions } from "./options";

// Autocomplete component default value must be one of the options provided or null
export const loadEmptyDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measuredAt: null,
  disapprovalReason: null,
  name: "",
  surname: "",
  personalId: "",
  birthdate: null,
  gender: null,
  nativeLanguage: null,
  heightCm: "",
  weightKg: "",
  handedness: null,
  visualCorrection: null,
  visualCorrectionDioptre: 0,
  email: "",
  phone: "",
  answers: [],
});

// Autocomplete component default value must be one of the options provided or null
export const loadPhantomFormDefaultValues = (): FormPropType => ({
  ...loadEmptyDefaultValues(),
  measuredAt: new Date(),
  birthdate: new Date(),
  visualCorrection: getAutocompleteOption(visualCorrectionOptions, "no"),
  // gender is set to 'Other' in the FormProbandInfo component
  // native language is set to 'Other' in the FormProbandInfo component
  // handedness is set to 'Undetermined' in the FormProbandInfo component
});

const loadAnswers = (
  answersIncludingQuestions: VisitFormAnswerIncludingQuestion[],
  defaultComment?: string
): FormAnswer[] =>
  answersIncludingQuestions.map(
    (answer): FormAnswer => ({
      questionId: answer.questionId,
      answer: answer.answer,
      mustBeApproved: answer.mustBeApproved,
      comment: defaultComment ?? answer.comment,
    })
  );

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromWaitingRoomVisitForm = (
  visitForm: WaitingRoomVisitFormIncludingQuestions
): FormPropType => ({
  project: null,
  device: null,
  measuredAt: new Date(),
  disapprovalReason: null,
  name: visitForm.name,
  surname: visitForm.surname,
  personalId: visitForm.personalId,
  birthdate: visitForm.birthdate,
  gender: visitForm.gender,
  nativeLanguage: {
    code: visitForm.nativeLanguageCode,
    nativeName: "",
    nameCs: "",
    nameEn: "",
    priority: null,
  },
  heightCm: visitForm.heightCm,
  weightKg: visitForm.weightKg,
  visualCorrection: getAutocompleteOption(
    visualCorrectionOptions,
    visitForm.visualCorrectionDioptre === 0 ? "no" : "yes"
  ),
  visualCorrectionDioptre: visitForm.visualCorrectionDioptre,
  handedness: visitForm.handedness,
  answers: loadAnswers(visitForm.answersIncludingQuestions, ""),
  email: visitForm.email,
  phone: visitForm.phone,
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromApprovalRoomVisitForm = (
  visitForm: ApprovalRoomVisitFormIncludingQuestionsDTO
): FormPropType => ({
  ...loadFormDefaultValuesFromWaitingRoomVisitForm(visitForm),
  // selected project is set in the FormProjectInfo component
  project: {
    uuid: visitForm.additionalInfo.projectUuid, // uuid is used to match the correct project loaded from the MAFILDB
    acronym: "",
    name: "",
  },
  // selected device is set in the FormProjectInfo component
  device: {
    id: visitForm.additionalInfo.deviceId, // id is used to match the correct project loaded from the MAFILDB
    name: "",
  },
  measuredAt: visitForm.additionalInfo.measuredAt,
  answers: loadAnswers(visitForm.answersIncludingQuestions),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (
  visit: DuplicatedProbandVisit | DuplicatedPhantomVisit
): FormPropType => ({
  // project and device must be selected by the operator
  project: null,
  device: null,
  measuredAt: new Date(),
  disapprovalReason: null,
  name: visit.subject.name,
  surname: visit.subject.surname,
  birthdate: visit.subject.birthdate,
  personalId: visit.subject.personalId,
  gender: visit.gender,
  nativeLanguage: visit.subject.nativeLanguage,
  heightCm: visit.heightCm,
  weightKg: visit.weightKg,
  visualCorrectionDioptre: visit.visualCorrectionDioptre,
  handedness: visit.handedness,
  email: visit.subject.email,
  phone: visit.subject.phone,
  visualCorrection: getAutocompleteOption(visualCorrectionOptions, visit.visualCorrectionDioptre === 0 ? "no" : "yes"),
  answers: loadAnswers(visit.answersIncludingQuestions),
});
