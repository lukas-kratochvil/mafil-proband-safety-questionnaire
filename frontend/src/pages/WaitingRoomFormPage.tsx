import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { WaitingRoomForm } from "@app/components/form/forms/WaitingRoomForm";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator_approval_form_schema";

const WaitingRoomFormPage = () => (
  <FormPageContainer
    FormPage={WaitingRoomForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default WaitingRoomFormPage;
