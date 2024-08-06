import { ApprovalRoomForm } from "@app/components/form/forms/ApprovalRoomForm";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

const ApprovalRoomFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalRoomForm}
    loadDefaultValues={loadEmptyDefaultValues}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default ApprovalRoomFormPage;
