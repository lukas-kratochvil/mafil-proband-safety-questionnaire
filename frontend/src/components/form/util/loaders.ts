import { FormPropType } from "@app/interfaces/form";
import { IVisit } from "@app/interfaces/visit";
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
  height: "",
  weight: "",
  handedness: null,
  visualCorrection: null,
  visualCorrectionValue: 0,
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
export const loadFormDefaultValuesFromVisit = (visit: IVisit): FormPropType => ({
  // selected project is set in the FormProjectInfo component
  project: {
    id: visit.projectInfo.projectId ?? "", // id is used to match the correct project loaded from the MAFILDB
    acronym: "",
    name: "",
  },
  // selected device is set in the FormProjectInfo component
  device: {
    id: visit.projectInfo.deviceId ?? "", // id is used to match the correct project loaded from the MAFILDB
    name: "",
  },
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  disapprovalReason: visit.projectInfo.disapprovalReason,
  ...visit.probandInfo,
  visualCorrection: getOption(visualCorrectionOptions, visit.probandInfo.visualCorrection),
  answers: visit.answers.map((answer) => ({ ...answer })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IVisit): FormPropType => ({
  ...loadFormDefaultValuesFromVisit(visit),
  project: null,
  device: null,
});
