import { string } from "yup";
import { operatorFinalizationFormSchema } from "./operator_finalization_form_schema";

export const operatorApprovalFormSchema = operatorFinalizationFormSchema.shape({
  disapprovalReason: string()
    .nullable()
    .test({
      name: "disapproval-reason-min-length",
      message: "form.validation.required",
      test: (reasonValue) => reasonValue === null || reasonValue === undefined || reasonValue.length > 0,
    }),
});
