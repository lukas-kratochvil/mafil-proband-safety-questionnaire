import { array, date, number, object, string } from "yup";
import { isEqual } from "date-fns";
import { rodnecislo } from "rodnecislo";
import { answersSchema, operatorAnswersSchema } from "./answers_schema";

export const defaultFormSchema = object({
  project: string().nullable(),
  device: string().nullable(),
  measurementDate: date().typeError("Datum není validní.").nullable(),
  name: string().trim().required("Jméno musí být vyplněno."),
  surname: string().trim().required("Jméno musí být vyplněno."),
  personalId: string().trim().required("Rodné číslo musí být vyplněno."),
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
    .required("Datum narození musí být vyplněno."),
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
    .required("Pohlaví musí být vyplněno."),
  nativeLanguage: string().nullable().required("Mateřský jazyk musí být vyplněn."),
  height: number()
    .typeError("Výška musí být kladné číslo.")
    .positive("Výška musí být kladné číslo.")
    .required("Výška musí být vyplněna."),
  weight: number()
    .typeError("Váha musí být kladné číslo.")
    .positive("Váha musí být kladné číslo.")
    .required("Váha musí být vyplněna."),
  sideDominance: string().nullable().required("Stranová dominance musí být vyplněná."),
  visualCorrection: string().nullable().required("Zraková korekce musí být vyplněna."),
  visualCorrectionValue: number()
    .default(0)
    .typeError("Hodnota zrakové korekce není validní.")
    .when("visualCorrection", {
      is: "Ano", // TODO: make enum
      then: number()
        .notOneOf([0], "Hodnota zrakové korekce se nesmí rovnat nule.")
        .min(-200, "Hodnota zrakové korekce není validní - je příliš nízká.")
        .max(200, "Hodnota zrakové korekce není validní - je příliš vysoká.")
        .required("Hodnota zrakové korekce musí být vyplněna."),
    }),
  email: string().trim().email("Email není validní."),
  phoneNumber: string()
    .trim()
    .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "Telefonní číslo není validní."),
  answers: array().of(answersSchema).required(),
});

export const operatorFormSchema = defaultFormSchema.shape({
  project: string().nullable().required("Projekt musí být vyplněn."),
  device: string().nullable().required("Přístroj magnetické rezonance musí být vyplněný."),
  measurementDate: date().nullable().required("Datum měření musí být vyplněno."),
  answers: array().of(operatorAnswersSchema).required("Všechny bezpečnostní otázky musí být zodpovězeny."),
});
