import { ApprovalRoomForm } from "@app/components/form/forms/ApprovalRoomForm";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";

const ApprovalRoomFormPage = () => (
  <FormPageContainer
    FormPage={ApprovalRoomForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default ApprovalRoomFormPage;
