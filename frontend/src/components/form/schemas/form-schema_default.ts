import { array, date, mixed, number, object, string } from "yup";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, VisualCorrection } from "@app/interfaces/visit";
import { getOption, IOption, visualCorrectionOptions } from "../util/options";

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
    measurementDate: date().nullable().typeError("form.validation.notValid"),
    name: string().trim().required("form.validation.required"),
    surname: string().trim().required("form.validation.required"),
    personalId: string().trim().required("form.validation.required"),
    birthdate: date()
      .nullable()
      .typeError("form.validation.notValid")
      .max(new Date(), "form.validation.birthdateMaxDate")
      .required("form.validation.required"),
    gender: mixed<IOption>().nullable().required("form.validation.required"),
    nativeLanguage: string().nullable().required("form.validation.required"),
    height: number()
      .typeError("form.validation.notValid")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    weight: number()
      .typeError("form.validation.notValid")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    handedness: mixed<IOption>().nullable().required("form.validation.required"),
    visualCorrection: mixed<IOption>().nullable().required("form.validation.required"),
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
      .when("phone", {
        is: "",
        then: string().email("form.validation.notValid"),
        otherwise: string().email("form.validation.notValid").required("form.validation.probandContacts"),
      }),
    phone: string()
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
  [["email", "phone"]]
);
