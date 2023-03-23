import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { PhantomForm } from "@app/components/form/forms/PhantomForm";
import { operatorFinalizationFormSchema } from "@app/components/form/schemas/operator_finalization_form_schema";
import { loadPhantomFormDefaultValues } from "@app/components/form/util/loaders";

const PhantomFormPage = () => (
  <FormPageContainer
    FormPage={PhantomForm}
    validationSchema={operatorFinalizationFormSchema}
    loadDefaultValues={loadPhantomFormDefaultValues}
  />
);

export default PhantomFormPage;
