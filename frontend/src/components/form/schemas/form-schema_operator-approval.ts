import { string } from "yup";
import { operatorFormSchema } from "./form-schema_operator";

export const operatorApprovalFormSchema = operatorFormSchema.shape({
  disapprovalReason: string()
    .nullable()
    .test({
      name: "disapproval-reason-min-length",
      message: "form.validation.disapprovalReasonMinLength",
      test: (noteValue) => noteValue === null || noteValue === undefined || noteValue.length > 0,
    }),
});
