import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { ProbandForm } from "@app/components/form/forms/ProbandForm";
import { probandFormSchema } from "@app/components/form/schemas/proband-form-schema";

const ProbandFormPage = () => (
  <FormPageContainer
    FormPage={ProbandForm}
    validationSchema={probandFormSchema}
  />
);

export default ProbandFormPage;
