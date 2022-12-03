import { array, date, mixed, number, object, string } from "yup";
import { QuestionPartNumber } from "@interfaces/question";
import { AnswerOption, VisualCorrection } from "@interfaces/visit";
import {
  genderOptions,
  getOption,
  getOptionsValues,
  IOption,
  sideDominanceOptions,
  visualCorrectionOptions,
} from "../util/options";

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

export const defaultFormSchema = object().shape(
  {
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
      // TODO: make it a warning not validation error
      // .test({
      //   name: "birthdate-corresponds-to-personalId",
      //   message: "form.validation.birthdateNotCorrespondToPersonalId",
      //   test: (birthdate, testContext) => {
      //     const czechPersonalId = rodnecislo(testContext.parent.personalId);
      //     return (
      //       birthdate === undefined
      //       || birthdate === null
      //       || !czechPersonalId.isValid()
      //       || isEqual(czechPersonalId.birthDate(), birthdate)
      //     );
      //   },
      // })
      .required("form.validation.required"),
    gender: mixed<IOption>()
      .nullable()
      .test({
        name: "contained-in-gender-options",
        message: "form.validation.notValid",
        test: (genderOption) =>
          genderOption !== undefined
          && genderOption !== null
          && getOptionsValues(genderOptions).includes(genderOption.value),
      })
      // TODO: make it a warning not validation error
      // .test({
      //   name: "gender-corresponds-to-personalId",
      //   message: "form.validation.genderNotCorrespondToPersonalId",
      //   test: (gender, testContext) => {
      //     const czechPersonalId = rodnecislo(testContext.parent.personalId);
      //     return (
      //       gender === null
      //       || gender === undefined
      //       || !czechPersonalId.isValid()
      //       || (czechPersonalId.isMale() && [Gender.MALE, Gender.OTHER].includes(gender.value))
      //       || (czechPersonalId.isFemale() && [Gender.FEMALE, Gender.OTHER].includes(gender.value))
      //     );
      //   },
      // })
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
    sideDominance: mixed<IOption>()
      .nullable()
      .test({
        name: "contained-in-side-dominance-options",
        message: "form.validation.notValid",
        test: (sideDominanceOption) =>
          sideDominanceOption !== undefined
          && sideDominanceOption !== null
          && getOptionsValues(sideDominanceOptions).includes(sideDominanceOption.value),
      })
      .required("form.validation.required"),
    visualCorrection: mixed<IOption>()
      .nullable()
      .test({
        name: "contained-in-visual-correction-options",
        message: "form.validation.notValid",
        test: (visualCorrectionOption) =>
          visualCorrectionOption !== undefined
          && visualCorrectionOption !== null
          && getOptionsValues(visualCorrectionOptions).includes(visualCorrectionOption.value),
      })
      .required("form.validation.required"),
    visualCorrectionValue: number()
      .default(0)
      // We are accepting dot and comma as decimal separators
      .transform((_value, originalValue) => Number(String(originalValue).replace(/,/, ".")))
      .typeError("form.validation.notValid")
      .when("visualCorrection", {
        is: getOption(visualCorrectionOptions, VisualCorrection.YES),
        then: number()
          .typeError("form.validation.notValid")
          .notOneOf([0], "form.validation.visualCorrectionValueNotEmptyNotZero")
          .min(-50, "form.validation.visualCorrectionValueTooLow")
          .max(50, "form.validation.visualCorrectionValueTooHigh"),
      })
      .required("form.validation.required"),
    email: string()
      .trim()
      .when("phoneNumber", {
        is: "",
        then: string().email("form.validation.notValid"),
        otherwise: string().email("form.validation.notValid").required("form.validation.probandContacts"),
      }),
    phoneNumber: string()
      .trim()
      .when("email", {
        is: "",
        then: string().matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "form.validation.notValid"),
        otherwise: string()
          .matches(/^$|^(\+|00)?[1-9]{1}[0-9,\s]{3,}$/, "form.validation.notValid")
          .required("form.validation.probandContacts"),
      }),
    answers: array().of(answersSchema).required("form.validation.required"),
  },
  [["email", "phoneNumber"]]
);
