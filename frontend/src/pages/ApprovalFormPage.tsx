import { ApprovalForm } from "@app/components/form/forms/ApprovalForm";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator_approval_form_schema";

const ApprovalFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default ApprovalFormPage;
