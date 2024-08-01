import { string } from "yup";
import { operatorFinalizationFormSchema } from "./operator-finalization-form-schema";

export const operatorApprovalFormSchema = operatorFinalizationFormSchema.shape({
  disapprovalReason: string()
    .trim()
    .nullable()
    .test({
      name: "disapproval-reason-min-length",
      message: "form.validation.required",
      test: (disapprovalReasonValue) =>
        disapprovalReasonValue === null || disapprovalReasonValue === undefined || disapprovalReasonValue.length > 0,
    }),
});
