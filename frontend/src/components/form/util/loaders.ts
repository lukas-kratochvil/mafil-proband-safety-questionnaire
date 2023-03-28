import { FormPropType } from "@app/model/form";
import { QuestionPartNumber } from "@app/model/question";
import { IVisit, VisualCorrection } from "@app/model/visit";
import { IApprovalRoomVisitFormDTO, IWaitingRoomVisitFormDTO } from "@app/util/server_API/dto";
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
export const loadFormDefaultValuesFromWaitingRoomVisitForm = (visitForm: IWaitingRoomVisitFormDTO): FormPropType => ({
  project: null,
  device: null,
  measuredAt: new Date(),
  disapprovalReason: null,
  ...visitForm.probandInfo,
  visualCorrection: getOption(
    visualCorrectionOptions,
    visitForm.probandInfo.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
  ),
  // TODO: how to get question part number?
  answers: visitForm.answers.map((answer) => ({ ...answer, comment: "", partNumber: QuestionPartNumber.ONE })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromApprovalRoomVisitForm = (visitForm: IApprovalRoomVisitFormDTO): FormPropType => ({
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
  // TODO: how to get question part number?
  answers: visitForm.answers.map((answer) => ({ ...answer, partNumber: QuestionPartNumber.ONE })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IVisit): FormPropType => ({
  project: null,
  device: null,
  measuredAt: visit.projectInfo.measuredAt ?? new Date(),
  disapprovalReason: visit.projectInfo.disapprovalReason,
  ...visit.probandInfo,
  visualCorrection: getOption(visualCorrectionOptions, visit.probandInfo.visualCorrection),
  answers: visit.answers.map((answer) => ({ ...answer })),
});
