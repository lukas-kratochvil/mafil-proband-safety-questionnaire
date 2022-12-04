import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { ApprovalForm } from "./forms/ApprovalForm";
import { FormPageContainer } from "./forms/FormPageContainer";

export const ApprovalFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalForm}
    validationSchema={operatorFormSchema}
  />
);
