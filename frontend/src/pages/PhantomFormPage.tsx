import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { PhantomForm } from "@app/components/form/forms/PhantomForm";
import { operatorFinalizationFormSchema } from "@app/components/form/schemas/operator-finalization-form-schema";
import { loadPhantomFormDefaultValues } from "@app/components/form/util/loaders";

const PhantomFormPage = () => (
  <FormPageContainer
    loadDefaultValues={loadPhantomFormDefaultValues}
    validationSchema={operatorFinalizationFormSchema}
  >
    <PhantomForm />
  </FormPageContainer>
);

export default PhantomFormPage;
