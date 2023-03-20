import { array, date, mixed, string } from "yup";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { answersSchema, defaultFormSchema } from "./form-schema_default";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("form.validation.required"),
    }),
});

export const operatorFormSchema = defaultFormSchema.shape({
  project: mixed<IProjectDTO>().nullable().required("form.validation.required"),
  device: mixed<IDeviceDTO>().nullable().required("form.validation.required"),
  measurementDate: date().nullable().required("form.validation.required"),
  answers: array().of(operatorAnswersSchema).required("form.validation.safetyQuestionsRequired"),
});
