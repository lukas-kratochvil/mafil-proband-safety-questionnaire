import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { ProbandForm } from "@app/components/form/forms/ProbandForm";
import { defaultFormSchema } from "@app/components/form/schemas/form-schema_default";

const ProbandFormPage = () => (
  <FormPageContainer
    FormPage={ProbandForm}
    validationSchema={defaultFormSchema}
  />
);

export default ProbandFormPage;
