import { FormPropType } from "@app/model/form";
import { IDuplicatedVisitIncludingQuestions, VisualCorrection } from "@app/model/visit";
import {
  IApprovalRoomVisitFormIncludingQuestionsDTO,
  IWaitingRoomVisitFormIncludingQuestionsDTO,
} from "@app/util/server_API/dto";
import { getOption, visualCorrectionOptions } from "./options";

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
  // gender 'Other' is set in the FormProbandInfo component
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromWaitingRoomVisitForm = (
  visitForm: IWaitingRoomVisitFormIncludingQuestionsDTO
): FormPropType => ({
  project: null,
  device: null,
  measuredAt: new Date(),
  disapprovalReason: null,
  ...visitForm,
  visualCorrection: getOption(
    visualCorrectionOptions,
    visitForm.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
  ),
  answers: visitForm.answersIncludingQuestions.map((answer) => ({ ...answer, comment: "" })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromApprovalRoomVisitForm = (
  visitForm: IApprovalRoomVisitFormIncludingQuestionsDTO
): FormPropType => ({
  ...loadFormDefaultValuesFromWaitingRoomVisitForm(visitForm),
  // selected project is set in the FormProjectInfo component
  project: {
    id: visitForm.additionalInfo.projectId ?? "", // id is used to match the correct project loaded from the MAFILDB
    acronym: "",
    name: "",
  },
  // selected device is set in the FormProjectInfo component
  device: {
    id: visitForm.additionalInfo.deviceId ?? "", // id is used to match the correct project loaded from the MAFILDB
    name: "",
  },
  measuredAt: visitForm.additionalInfo.measuredAt ?? new Date(),
  answers: visitForm.answersIncludingQuestions.map((answer) => ({ ...answer })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IDuplicatedVisitIncludingQuestions): FormPropType => ({
  ...visit,
  project: null,
  device: null,
  measuredAt: new Date(),
  disapprovalReason: null,
  visualCorrection: getOption(
    visualCorrectionOptions,
    visit.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
  ),
  answers: visit.answersIncludingQuestions.map((answer) => ({ ...answer })),
});
