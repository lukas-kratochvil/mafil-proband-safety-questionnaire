import { array, date, mixed, number, object, string } from "yup";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, VisualCorrection } from "@app/interfaces/visit";
import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "@app/util/server_API/dto";
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
    name: string().trim().required("form.validation.required"),
    surname: string().trim().required("form.validation.required"),
    personalId: string().trim().required("form.validation.required"),
    birthdate: date()
      .nullable()
      .typeError("form.validation.notValid")
      .max(new Date(), "form.validation.birthdateMaxDate")
      .required("form.validation.required"),
    gender: mixed<IGenderDTO>().nullable().required("form.validation.required"),
    nativeLanguage: mixed<INativeLanguageDTO>().nullable().required("form.validation.required"),
    heightCm: number()
      .typeError("form.validation.notValid")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    weightKg: number()
      .typeError("form.validation.notValid")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    handedness: mixed<IHandednessDTO>().nullable().required("form.validation.required"),
    visualCorrection: mixed<IOption>().nullable().required("form.validation.required"),
    visualCorrectionDioptre: number()
      .default(0)
      // We are accepting dot and comma as decimal separators
      .transform((_value, originalValue) => Number(String(originalValue).replace(/,/, ".")))
      .typeError("form.validation.notValid")
      .when("visualCorrection", {
        is: getOption(visualCorrectionOptions, VisualCorrection.YES),
        then: number()
          .typeError("form.validation.notValid")
          .notOneOf([0], "form.validation.visualCorrectionDioptreNotEmptyNotZero")
          .min(-50, "form.validation.visualCorrectionDioptreTooLow")
          .max(50, "form.validation.visualCorrectionDioptreTooHigh"),
      })
      .required("form.validation.required"),
    answers: array().of(answersSchema).required("form.validation.required"),
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
  },
  [["email", "phone"]]
);
