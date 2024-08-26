import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { WaitingRoomForm } from "@app/components/form/forms/WaitingRoomForm";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

const WaitingRoomFormPage = () => (
  <FormPageContainer
    loadDefaultValues={loadEmptyDefaultValues}
    validationSchema={operatorApprovalFormSchema}
  >
    <WaitingRoomForm />
  </FormPageContainer>
);

export default WaitingRoomFormPage;
