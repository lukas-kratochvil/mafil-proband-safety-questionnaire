import { DuplicationForm } from "@components/form/forms/DuplicationForm";
import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@components/form/schemas/form-schema_operator-approval";

const DuplicationFormPage = () => (
  <FormPageContainer
    FormPage={DuplicationForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default DuplicationFormPage;
