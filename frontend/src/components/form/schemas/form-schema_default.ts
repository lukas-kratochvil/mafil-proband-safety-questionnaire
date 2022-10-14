import { isEqual } from "date-fns";
import { rodnecislo } from "rodnecislo";
import { array, date, mixed, number, object, string } from "yup";
import { Gender, SideDominance, VisualCorrection } from "../../../data/form_data";
import { QuestionPartNumber } from "../../../data/question_data";
import { AnswerOption } from "../../../data/visit_data";

export const answersSchema = object({
  questionId: string().trim().required(),
  partNumber: number()
    .oneOf(
      Object.values(QuestionPartNumber)
        .filter((val) => typeof val === "number")
        .map((val) => +val)
    )
    .required(),
  answer: mixed<AnswerOption>().nullable().oneOf(Object.values(AnswerOption)).required("Pole je povinné."),
  comment: string().nullable(),
});

export const defaultFormSchema = object({
  project: string().nullable(),
  device: string().nullable(),
  measurementDate: date().typeError("Datum není validní.").nullable(),
  name: string().trim().required("Pole je povinné."),
  surname: string().trim().required("Pole je povinné."),
  personalId: string().trim().required("Pole je povinné."),
  birthdate: date()
    .nullable()
    .typeError("Datum není validní.")
    .max(new Date(), "Maximální povolená hodnota pro datum narození je dnes.")
    .test({
      name: "birthdate-corresponds-to-personalId",
      message: "Datum narození není shodné s hodnotou získanou z poskytnutého českého nebo slovenského rodného čísla.",
      test: (birthdate, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          birthdate === undefined
          || birthdate === null
          || !czechPersonalId.isValid()
          || isEqual(czechPersonalId.birthDate(), birthdate)
        );
      },
    })
    .required("Pole je povinné."),
  gender: mixed<Gender>()
    .nullable()
    .oneOf(Object.values(Gender))
    .test({
      name: "gender-corresponds-to-personalId",
      message: "Pohlaví není shodné s hodnotou získanou z poskytnutého českého nebo slovenského rodného čísla.",
      test: (gender, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          gender === null
          || gender === undefined
          || !czechPersonalId.isValid()
          || (czechPersonalId.isMale() && [Gender.MAN, Gender.OTHER].includes(gender))
          || (czechPersonalId.isFemale() && [Gender.WOMAN, Gender.OTHER].includes(gender))
        );
      },
    })
    .required("Pole je povinné."),
  nativeLanguage: string().nullable().required("Mateřský jazyk musí být vyplněn."),
  height: number()
    .typeError("Výška musí být kladné číslo.")
    .positive("Výška musí být kladné číslo.")
    .required("Pole je povinné."),
  weight: number()
    .typeError("Váha musí být kladné číslo.")
    .positive("Váha musí být kladné číslo.")
    .required("Pole je povinné."),
  sideDominance: mixed<SideDominance>().nullable().oneOf(Object.values(SideDominance)).required("Pole je povinné."),
  visualCorrection: mixed<VisualCorrection>()
    .nullable()
    .oneOf(Object.values(VisualCorrection))
    .required("Pole je povinné."),
  visualCorrectionValue: number()
    .default(0)
    .typeError("Hodnota zrakové korekce není validní.")
    .when("visualCorrection", {
      is: VisualCorrection.YES,
      then: number()
        .typeError("Hodnota zrakové korekce není validní.")
        .notOneOf([0], "Hodnota zrakové korekce se nesmí rovnat nule.")
        .min(-200, "Hodnota zrakové korekce není validní - je příliš nízká.")
        .max(200, "Hodnota zrakové korekce není validní - je příliš vysoká.")
        .required("Pole je povinné."),
    }),
  email: string().trim().email("Email není validní."),
  phoneNumber: string()
    .trim()
    .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "Telefonní číslo není validní."),
  answers: array().of(answersSchema).required(),
});
