import { array, date, mixed, string } from "yup";
import type { Device } from "@app/model/device";
import type { Project } from "@app/model/project";
import { answersSchema, probandFormSchema } from "./proband-form-schema";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "YES",
      then: (schema) => schema.normalizeWhitespace().required("form.validation.required"),
    }),
});

export const operatorFinalizationFormSchema = probandFormSchema.shape({
  project: mixed<Project>().nullable().required("form.validation.required"),
  device: mixed<Device>().nullable().required("form.validation.required"),
  measuredAt: date().nullable().required("form.validation.required"),
  answers: array().of(operatorAnswersSchema).required("form.validation.safetyQuestionsRequired"),
});
