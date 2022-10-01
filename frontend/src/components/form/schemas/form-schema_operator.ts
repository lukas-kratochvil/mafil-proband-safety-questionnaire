import { array, date, string } from "yup";
import { answersSchema, defaultFormSchema } from "./form-schema_default";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("Pole je povinné."),
    }),
});

export const operatorFormSchema = defaultFormSchema.shape({
  project: string().nullable().required("Pole je povinné."),
  device: string().nullable().required("Pole je povinné."),
  measurementDate: date().nullable().required("Pole je povinné."),
  answers: array().of(operatorAnswersSchema).required("Všechny bezpečnostní otázky musí být zodpovězeny."),
});
