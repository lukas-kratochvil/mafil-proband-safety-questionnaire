import { ApprovalForm } from "@components/form/forms/ApprovalForm";
import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@components/form/schemas/form-schema_operator-approval";

const ApprovalFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default ApprovalFormPage;
