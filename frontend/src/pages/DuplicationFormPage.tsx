import { DuplicationForm } from "@components/form/forms/DuplicationForm";
import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";

const DuplicationFormPage = () => (
  <FormPageContainer
    FormPage={DuplicationForm}
    validationSchema={operatorFormSchema}
  />
);

export default DuplicationFormPage;
