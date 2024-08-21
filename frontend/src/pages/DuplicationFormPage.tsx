import { useLocation, type Location } from "react-router-dom";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { PhantomDuplicationForm } from "@app/components/form/forms/PhantomDuplicationForm";
import { ProbandDuplicationForm } from "@app/components/form/forms/ProbandDuplicationForm";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";

type DuplicationLocationState = {
  isPhantom: boolean;
};

const DuplicationFormPage = () => {
  const location = useLocation() as Location<DuplicationLocationState>;

  if (location.state.isPhantom) {
    return (
      <FormPageContainer
        FormPage={PhantomDuplicationForm}
        loadDefaultValues={loadEmptyDefaultValues}
        validationSchema={operatorApprovalFormSchema}
      />
    );
  }

  return (
    <FormPageContainer
      FormPage={ProbandDuplicationForm}
      loadDefaultValues={loadEmptyDefaultValues}
      validationSchema={operatorApprovalFormSchema}
    />
  );
};

export default DuplicationFormPage;
