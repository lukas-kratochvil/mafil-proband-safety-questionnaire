import { array, date, string } from "yup";
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
  project: string().nullable().required("form.validation.required"),
  device: string().nullable().required("form.validation.required"),
  measurementDate: date().nullable().required("form.validation.required"),
  answers: array().of(operatorAnswersSchema).required("form.validation.safetyQuestionsRequired"),
});
