import { FormPageContainer } from "@components/form/forms/FormPageContainer";
import { PhantomForm } from "@components/form/forms/PhantomForm";
import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { loadPhantomFormDefaultValues } from "@components/form/util/loaders";

export const PhantomFormPage = () => (
  <FormPageContainer
    FormPage={PhantomForm}
    validationSchema={operatorFormSchema}
    loadDefaultValues={loadPhantomFormDefaultValues}
  />
);
