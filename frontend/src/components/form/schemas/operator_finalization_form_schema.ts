import { array, date, mixed, string } from "yup";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { answersSchema, probandFormSchema } from "./proband_form_schema";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("form.validation.required"),
    }),
});

export const operatorFinalizationFormSchema = probandFormSchema.shape({
  project: mixed<IProjectDTO>().nullable().required("form.validation.required"),
  device: mixed<IDeviceDTO>().nullable().required("form.validation.required"),
  measurementDate: date().nullable().required("form.validation.required"),
  answers: array().of(operatorAnswersSchema).required("form.validation.safetyQuestionsRequired"),
});
