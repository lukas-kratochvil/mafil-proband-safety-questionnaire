import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { WaitingRoomForm } from "@components/form/forms/WaitingRoomForm";
import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";

const WaitingRoomFormPage = () => (
  <FormPageContainer
    FormPage={WaitingRoomForm}
    validationSchema={operatorFormSchema}
  />
);

export default WaitingRoomFormPage;
