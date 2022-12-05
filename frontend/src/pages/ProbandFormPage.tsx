import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { ProbandForm } from "@components/form/forms/ProbandForm";
import { defaultFormSchema } from "@components/form/schemas/form-schema_default";

const ProbandFormPage = () => (
  <FormPageContainer
    FormPage={ProbandForm}
    validationSchema={defaultFormSchema}
  />
);

export default ProbandFormPage;
