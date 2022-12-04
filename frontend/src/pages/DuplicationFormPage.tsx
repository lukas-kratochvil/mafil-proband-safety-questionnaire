import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { DuplicationForm } from "./forms/DuplicationForm";
import { FormPageContainer } from "./forms/FormPageContainer";

export const DuplicationFormPage = () => (
  <FormPageContainer
    FormPage={DuplicationForm}
    validationSchema={operatorFormSchema}
  />
);
