import { number, object, string } from "yup";

export const answersSchema = object({
  questionId: string().trim().required(),
  partNumber: number().oneOf([1, 2]).required(),
  answer: string().nullable().required("Odpoveď na bezpečnostní otázku je povinná."),
  comment: string().nullable(),
});

export const operatorAnswersSchema = answersSchema.shape({
  comment: string()
    .default("")
    .when("answer", {
      is: "yes",
      then: string().trim().required("Komentář musí být vyplněn."),
    }),
});
