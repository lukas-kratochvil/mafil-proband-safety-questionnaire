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

// phone number can be empty if proband does not want to fill in contact info
const PHONE_NUMBER_REGEX = /^$|^(\+|00)?[1-9]{1}[0-9]{3,}$/;

export const probandFormSchema = object().shape(
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
      // accepting dot and comma as decimal separators
      .transform((_value, originalValue) => Number(String(originalValue).replace(/,/, ".")))
      .typeError("form.validation.notValid")
      .when("visualCorrection", {
        is: getOption(visualCorrectionOptions, VisualCorrection.YES),
        then: number()
          .typeError("form.validation.notValid")
          .notOneOf([0], "form.validation.visualCorrectionDioptreNotZero")
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
      .transform((_value, originalValue: string) => {
        // get rid of all the white-spaces and replace '+' at the beginning with the '00'
        const phoneNumber = originalValue.replace(/\s|-|\(|\)/g, "").replace(/^\+/, "00");
        // prefix with czech phone number code (+420) if the phone number does not have any national phone number code
        const CZECH_PHONE_NUMBER_CODE = "00420";
        return phoneNumber.length === 0 || /^(00)/.test(phoneNumber)
          ? phoneNumber
          : `${CZECH_PHONE_NUMBER_CODE}${phoneNumber}`;
      })
      .when("email", {
        is: "",
        then: string().matches(PHONE_NUMBER_REGEX, "form.validation.notValid"),
        otherwise: string()
          .matches(PHONE_NUMBER_REGEX, "form.validation.notValid")
          .required("form.validation.probandContacts"),
      }),
  },
  [["email", "phone"]]
);
