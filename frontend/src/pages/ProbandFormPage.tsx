import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { ProbandForm } from "@app/components/form/forms/ProbandForm";
import { probandFormSchema } from "@app/components/form/schemas/proband-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

const ProbandFormPage = () => (
  <FormPageContainer
    loadDefaultValues={loadEmptyDefaultValues}
    validationSchema={probandFormSchema}
  >
    <ProbandForm />
  </FormPageContainer>
);

export default ProbandFormPage;
