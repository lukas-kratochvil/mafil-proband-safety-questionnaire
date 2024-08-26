import { useLocation, type Location } from "react-router-dom";
import { FormPageContainer } from "@app/components/form/forms/FormPageContainer";
import { PhantomDuplicationForm } from "@app/components/form/forms/PhantomDuplicationForm";
import { ProbandDuplicationForm } from "@app/components/form/forms/ProbandDuplicationForm";
import { operatorApprovalFormSchema } from "@app/components/form/schemas/operator-approval-form-schema";
import { loadEmptyDefaultValues } from "@app/components/form/util/loaders";
import type { DuplicationFormPageLocationState } from "@app/util/utils";

const DuplicationFormPage = () => {
  const location = useLocation() as Location<DuplicationFormPageLocationState>;

  if (location.state.isPhantom) {
    return (
      <FormPageContainer
        loadDefaultValues={loadEmptyDefaultValues}
        validationSchema={operatorApprovalFormSchema}
      >
        <PhantomDuplicationForm />
      </FormPageContainer>
    );
  }

  return (
    <FormPageContainer
      loadDefaultValues={loadEmptyDefaultValues}
      validationSchema={operatorApprovalFormSchema}
    >
      <ProbandDuplicationForm />
    </FormPageContainer>
  );
};

export default DuplicationFormPage;
