import { IVisit } from "../../../data/visit_data";
import { FormPropType } from "../types/types";

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measurementDate: null,
  name: "",
  surname: "",
  personalId: "",
  birthdate: null,
  gender: null,
  nativeLanguage: null,
  height: "",
  weight: "",
  sideDominance: null,
  visualCorrection: null,
  visualCorrectionValue: 0,
  email: "",
  phoneNumber: "",
  answers: [],
});

// Autocomplete component default value must be one of the options provided or null
export const loadFantomFormDefaultValues = (): FormPropType => ({
  ...loadFormDefaultValues(),
  measurementDate: new Date(),
  gender: "Jiné",
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromVisit = (visit: IVisit): FormPropType => ({
  project: visit.projectInfo.project ?? null,
  device: visit.projectInfo.device ?? null,
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  ...visit.probandInfo,
  answers: visit.answers.map((answer) => ({ ...answer })),
});
