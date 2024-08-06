import { DuplicationForm } from "@app/components/form/forms/DuplicationForm";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

const DuplicationFormPage = () => (
  <FormPageContainer
    FormPage={DuplicationForm}
    loadDefaultValues={loadEmptyDefaultValues}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default DuplicationFormPage;
