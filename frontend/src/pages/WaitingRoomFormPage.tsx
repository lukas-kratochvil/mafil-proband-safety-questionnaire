import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { WaitingRoomForm } from "@components/form/forms/WaitingRoomForm";
import { operatorApprovalFormSchema } from "@components/form/schemas/form-schema_operator-approval";

const WaitingRoomFormPage = () => (
  <FormPageContainer
    FormPage={WaitingRoomForm}
    validationSchema={operatorApprovalFormSchema}
  />
);

export default WaitingRoomFormPage;
