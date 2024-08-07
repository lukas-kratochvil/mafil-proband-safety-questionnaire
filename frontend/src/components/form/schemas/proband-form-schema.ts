import { endOfToday } from "date-fns";
import { array, boolean, date, mixed, number, object, string } from "yup";
import type { AnswerOption } from "@app/model/form";
import { answerOptions } from "@app/model/form";
import type { NativeLanguage } from "@app/model/language";
import type { GenderDTO, HandednessDTO } from "@app/util/server_API/dto";
import {
  getAutocompleteOption,
  visualCorrectionOptions,
  type AutocompleteOption,
  type VisualCorrection,
} from "../util/options";
import "./yup-custom-methods";

export const answersSchema = object({
  questionId: string().removeWhitespace().required("form.validation.required"),
  mustBeApproved: boolean().required("form.validation.required"),
  answer: mixed<AnswerOption>().nullable().oneOf(Object.values(answerOptions)).required("form.validation.required"),
  comment: string().normalizeWhitespace().nullable(),
});

export const probandFormSchema = object().shape(
  {
    name: string().normalizeWhitespace().required("form.validation.required"),
    surname: string().normalizeWhitespace().required("form.validation.required"),
    personalId: string().removeWhitespace().required("form.validation.required"),
    birthdate: date()
      .nullable()
      .typeError("form.validation.notValid")
      .max(endOfToday(), "form.validation.birthdateMaxDate")
      .required("form.validation.required"),
    gender: mixed<GenderDTO>().nullable().required("form.validation.required"),
    nativeLanguage: mixed<NativeLanguage>().nullable().required("form.validation.required"),
    heightCm: number()
      .typeError("form.validation.notValid")
      // integer() accepts integer numbers in decimal notation (will not throw an error), but converts them to integers
      // for example: accepts '1.0' and converts it to '1'
      .integer("form.validation.integer")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    weightKg: number()
      .typeError("form.validation.notValid")
      // integer() accepts integer numbers in decimal notation, but converts them to integers
      // for example: accepts '1.0' and converts it to '1'
      .integer("form.validation.integer")
      .positive("form.validation.positive")
      .required("form.validation.required"),
    handedness: mixed<HandednessDTO>().nullable().required("form.validation.required"),
    visualCorrection: mixed<AutocompleteOption<VisualCorrection>>().nullable().required("form.validation.required"),
    visualCorrectionDioptre: number()
      .default(0)
      // accepting dot and comma as decimal separators
      .transform((_value, originalValue) => Number(String(originalValue).replace(/,/, ".")))
      .typeError("form.validation.notValid")
      .when("visualCorrection", {
        is: getAutocompleteOption(visualCorrectionOptions, "yes"),
        then: (schema) =>
          schema.typeError("form.validation.notValid").notOneOf([0], "form.validation.visualCorrectionDioptreNotZero"),
      })
      .required("form.validation.required"),
    answers: array().of(answersSchema).required("form.validation.required"),
    email: string()
      .removeWhitespace()
      .when("phone", ([phone], schema) =>
        phone === "" ? schema.customEmail() : schema.customEmail().required("form.validation.probandContacts")
      ),
    phone: string()
      .transform((_value, originalValue: string) => {
        const phoneNumber = originalValue
          .replace(/\s|-|\(|\)/g, "") // get rid of all the white-spaces
          .replace(/^\+/, "00"); // replace '+' at the beginning with the '00' prefix

        // if the phone number does not have any national phone number code prefix it will be automatically prefixed with the czech phone number code prefix '00420'
        const CZECH_PHONE_NUMBER_CODE = "00420";
        return phoneNumber.length === 0 || /^(00)/.test(phoneNumber)
          ? phoneNumber
          : `${CZECH_PHONE_NUMBER_CODE}${phoneNumber}`;
      })
      .when("email", ([email], schema) =>
        email === ""
          ? schema.customPhoneNumber()
          : schema.customPhoneNumber().required("form.validation.probandContacts")
      ),
  },
  [["email", "phone"]]
);
