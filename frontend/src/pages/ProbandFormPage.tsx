import { defaultFormSchema } from "@components/form/schemas/form-schema_default";
import { FormPageContainer } from "./forms/FormPageContainer";
import { ProbandForm } from "./forms/ProbandForm";

export const ProbandFormPage = () => (
  <FormPageContainer
    FormPage={ProbandForm}
    validationSchema={defaultFormSchema}
  />
);
