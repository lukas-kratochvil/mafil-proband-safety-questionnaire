import { isEqual } from "date-fns";
import { rodnecislo } from "rodnecislo";
import { array, date, number, object, string } from "yup";

export const answersSchema = object({
  questionId: string().trim().required(),
  partNumber: number().oneOf([1, 2]).required(),
  answer: string().nullable().required("Pole je povinné."),
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
  gender: string()
    .nullable()
    .test({
      name: "gender-corresponds-to-personalId",
      message: "Pohlaví není shodné s hodnotou získanou z poskytnutého českého nebo slovenského rodného čísla.",
      test: (gender, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          !czechPersonalId.isValid()
          || (czechPersonalId.isMale() && ["Muž", "Jiné"].includes(gender ?? ""))
          || (czechPersonalId.isFemale() && ["Žena", "Jiné"].includes(gender ?? ""))
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
  sideDominance: string().nullable().required("Pole je povinné."),
  visualCorrection: string().nullable().required("Pole je povinné."),
  visualCorrectionValue: number()
    .default(0)
    .typeError("Hodnota zrakové korekce není validní.")
    .when("visualCorrection", {
      is: "Ano", // TODO: make enum
      then: number()
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
