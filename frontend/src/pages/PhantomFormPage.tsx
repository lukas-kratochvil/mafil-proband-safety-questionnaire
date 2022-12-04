import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { loadPhantomFormDefaultValues } from "@components/form/util/loaders";
import { FormPageContainer } from "./forms/FormPageContainer";
import { PhantomForm } from "./forms/PhantomForm";

export const PhantomFormPage = () => (
  <FormPageContainer
    FormPage={PhantomForm}
    validationSchema={operatorFormSchema}
    loadDefaultValues={loadPhantomFormDefaultValues}
  />
);
