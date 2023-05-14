import { array, date, mixed, string } from "yup";
import { AnswerOption } from "@app/model/form";
import { IDeviceDTO, IProjectDTO } from "@app/util/mafildb_API/dto";
import { answersSchema, probandFormSchema } from "./proband-form-schema";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: AnswerOption.YES,
      then: string().trim().required("form.validation.required"),
    }),
});

export const operatorFinalizationFormSchema = probandFormSchema.shape({
  project: mixed<IProjectDTO>().nullable().required("form.validation.required"),
  device: mixed<IDeviceDTO>().nullable().required("form.validation.required"),
  measuredAt: date().nullable().required("form.validation.required"),
  answers: array().of(operatorAnswersSchema).required("form.validation.safetyQuestionsRequired"),
});
