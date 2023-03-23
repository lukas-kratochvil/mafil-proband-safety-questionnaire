import { FormPropType } from "@app/interfaces/form";
import { QuestionPartNumber } from "@app/interfaces/question";
import { IVisit, VisualCorrection } from "@app/interfaces/visit";
import { IApprovalRoomVisitFormDTO, IWaitingRoomVisitFormDTO } from "@app/util/server_API/dto";
import { getOption, visualCorrectionOptions } from "./options";

// Autocomplete component default value must be one of the options provided or null
export const loadEmptyDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measurementDate: null,
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
  measurementDate: new Date(),
  // gender 'Other' is set in the FormProbandInfo component
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromWaitingRoomVisitForm = (visit: IWaitingRoomVisitFormDTO): FormPropType => ({
  project: null,
  device: null,
  measurementDate: new Date(),
  disapprovalReason: null,
  ...visit.probandInfo,
  gender: {
    id: visit.probandInfo.genderId,
    code: "",
    translations: [],
  },
  nativeLanguage: {
    id: visit.probandInfo.nativeLanguageId,
    code: "",
    order: null,
    translations: [],
  },
  handedness: {
    id: visit.probandInfo.handednessId,
    code: "",
    translations: [],
  },
  visualCorrection: getOption(
    visualCorrectionOptions,
    visit.probandInfo.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
  ),
  answers: visit.answers.map((answer) => ({ ...answer, comment: "", partNumber: QuestionPartNumber.ONE })), // TODO: how to get question part number?
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromApprovalRoomVisitForm = (visit: IApprovalRoomVisitFormDTO): FormPropType => ({
  ...loadFormDefaultValuesFromWaitingRoomVisitForm(visit),
  // selected project is set in the FormProjectInfo component
  project: {
    id: visit.additionalInfo.projectId ?? "", // id is used to match the correct project loaded from the MAFILDB
    acronym: "",
    name: "",
  },
  // selected device is set in the FormProjectInfo component
  device: {
    id: visit.additionalInfo.deviceId ?? "", // id is used to match the correct project loaded from the MAFILDB
    name: "",
  },
  measurementDate: visit.additionalInfo.measuredAt ?? new Date(),
  answers: visit.answers.map((answer) => ({ ...answer, partNumber: QuestionPartNumber.ONE })), // TODO: how to get question part number?
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IVisit): FormPropType => ({
  project: null,
  device: null,
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  disapprovalReason: visit.projectInfo.disapprovalReason,
  ...visit.probandInfo,
  visualCorrection: getOption(visualCorrectionOptions, visit.probandInfo.visualCorrection),
  answers: visit.answers.map((answer) => ({ ...answer })),
});
