import { DuplicationForm } from "@app/components/form/forms/DuplicationForm";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator_approval_form_schema";

const DuplicationFormPage = () => (
  <FormPageContainer
    FormPage={DuplicationForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default DuplicationFormPage;
