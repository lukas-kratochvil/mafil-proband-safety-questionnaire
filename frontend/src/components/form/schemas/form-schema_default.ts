import { isEqual } from "date-fns";
import { rodnecislo } from "rodnecislo";
import { array, date, mixed, number, object, string } from "yup";
import { Gender, VisualCorrection } from "../../../data/form_data";
import { QuestionPartNumber } from "../../../data/question_data";
import { AnswerOption } from "../../../data/visit_data";
import { genderOptions, IOption, sideDominanceOptions, visualCorrectionOptions } from "../types/options";

export const answersSchema = object({
  questionId: string().trim().required("form.validation.required"),
  partNumber: number()
    .oneOf(
      Object.values(QuestionPartNumber)
        .filter((val) => typeof val === "number")
        .map((val) => +val)
    )
    .required("form.validation.required"),
  answer: mixed<AnswerOption>().nullable().oneOf(Object.values(AnswerOption)).required("form.validation.required"),
  comment: string().nullable(),
});

export const defaultFormSchema = object({
  project: string().nullable(),
  device: string().nullable(),
  measurementDate: date().typeError("form.validation.notValid").nullable(),
  name: string().trim().required("form.validation.required"),
  surname: string().trim().required("form.validation.required"),
  personalId: string().trim().required("form.validation.required"),
  birthdate: date()
    .nullable()
    .typeError("form.validation.notValid")
    .max(new Date(), "form.validation.birthdateMaxDate")
    .test({
      name: "birthdate-corresponds-to-personalId",
      message: "form.validation.birthdateNotCorrespondToPersonalId",
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
    .required("form.validation.required"),
  gender: mixed<IOption>()
    .nullable()
    .oneOf(genderOptions)
    .test({
      name: "gender-corresponds-to-personalId",
      message: "form.validation.genderNotCorrespondToPersonalId",
      test: (gender, testContext) => {
        const czechPersonalId = rodnecislo(testContext.parent.personalId);
        return (
          gender === null
          || gender === undefined
          || !czechPersonalId.isValid()
          || (czechPersonalId.isMale() && [Gender.MAN, Gender.OTHER].includes(gender.value))
          || (czechPersonalId.isFemale() && [Gender.WOMAN, Gender.OTHER].includes(gender.value))
        );
      },
    })
    .required("form.validation.required"),
  nativeLanguage: string().nullable().required("form.validation.required"),
  height: number()
    .typeError("form.validation.notValid")
    .positive("form.validation.positive")
    .required("form.validation.required"),
  weight: number()
    .typeError("form.validation.notValid")
    .positive("form.validation.positive")
    .required("form.validation.required"),
  sideDominance: mixed<IOption>().nullable().oneOf(sideDominanceOptions).required("form.validation.required"),
  visualCorrection: mixed<IOption>().nullable().oneOf(visualCorrectionOptions).required("form.validation.required"),
  visualCorrectionValue: number()
    .default(0)
    .typeError("form.validation.notValid")
    .when("visualCorrection", {
      is: VisualCorrection.YES,
      then: number()
        .typeError("form.validation.notValid")
        .notOneOf([0], "form.validation.visualCorrectionValueNotZero")
        .min(-200, "form.validation.visualCorrectionValueTooHigh")
        .max(200, "form.validation.visualCorrectionValueTooLow")
        .required("form.validation.required"),
    }),
  email: string().trim().email("form.validation.notValid"),
  phoneNumber: string()
    .trim()
    .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "form.validation.notValid"),
  answers: array().of(answersSchema).required("form.validation.required"),
});
