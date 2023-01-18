import { string } from "yup";
import { operatorFormSchema } from "./form-schema_operator";

export const operatorApprovalFormSchema = operatorFormSchema.shape({
  disapprovalReason: string()
    .nullable()
    .test({
      name: "disapproval-note-min-length",
      message: "form.validation.disapprovalNoteMinLength",
      test: (noteValue) => noteValue === null || noteValue === undefined || noteValue.length > 0,
    }),
});
