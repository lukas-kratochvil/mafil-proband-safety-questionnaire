import { array, date, string } from "yup";
import { answersSchema, defaultFormSchema } from "./form-schema_default";

const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("Komentář musí být vyplněn."),
    }),
});

export const operatorFormSchema = defaultFormSchema.shape({
  project: string().nullable().required("Projekt musí být vyplněn."),
  device: string().nullable().required("Přístroj magnetické rezonance musí být vyplněný."),
  measurementDate: date().nullable().required("Datum měření musí být vyplněno."),
  answers: array().of(operatorAnswersSchema).required("Všechny bezpečnostní otázky musí být zodpovězeny."),
});
