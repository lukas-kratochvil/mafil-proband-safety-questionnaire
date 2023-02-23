import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { WaitingRoomForm } from "@app/components/form/forms/WaitingRoomForm";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/form-schema_operator-approval";

const WaitingRoomFormPage = () => (
  <FormPageContainer
    FormPage={WaitingRoomForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default WaitingRoomFormPage;
