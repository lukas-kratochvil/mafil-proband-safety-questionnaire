import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { PhantomForm } from "@app/components/form/forms/PhantomForm";
import { operatorFormSchema } from "@app/components/form/schemas/form-schema_operator";
import { loadPhantomFormDefaultValues } from "@app/components/form/util/loaders";

const PhantomFormPage = () => (
  <FormPageContainer
    FormPage={PhantomForm}
    validationSchema={operatorFormSchema}
    loadDefaultValues={loadPhantomFormDefaultValues}
  />
);

export default PhantomFormPage;
