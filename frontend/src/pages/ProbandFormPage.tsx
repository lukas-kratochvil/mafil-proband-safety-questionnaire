import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { ProbandForm } from "@app/components/form/forms/ProbandForm";
import { probandFormSchema } from "@app/components/form/schemas/proband-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

const ProbandFormPage = () => (
  <FormPageContainer
    FormPage={ProbandForm}
    loadDefaultValues={loadEmptyDefaultValues}
    validationSchema={probandFormSchema}
  />
);

export default ProbandFormPage;
