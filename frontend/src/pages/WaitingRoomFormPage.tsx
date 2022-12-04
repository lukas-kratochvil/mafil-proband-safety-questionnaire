import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { FormPageContainer } from "./forms/FormPageContainer";
import { WaitingRoomForm } from "./forms/WaitingRoomForm";

export const WaitingRoomFormPage = () => (
  <FormPageContainer
    FormPage={WaitingRoomForm}
    validationSchema={operatorFormSchema}
  />
);
