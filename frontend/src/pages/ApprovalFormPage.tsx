import { ApprovalForm } from "@components/form/forms/ApprovalForm";
import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";

const ApprovalFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalForm}
    validationSchema={operatorFormSchema}
  />
);

export default ApprovalFormPage;
