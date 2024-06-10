import { useNavigate } from "react-router-dom";
import type { FormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import type { ValidatedOperatorFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import { addPdfToVisit, createPhantomVisit } from "@app/util/mafildb_API/calls";
import { generatePhantomPdf } from "@app/util/server_API/calls";
import { getBackButtonProps } from "@app/util/utils";
import { getValidatedOperatorFormData } from "../util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();
  const { operator } = useAuth();

  const formButtons: FormButtonsProps<ValidatedOperatorFormData> = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: async (data) => {
        const visit = await createPhantomVisit(data, operator?.username, new Date());
        const pdf = await generatePhantomPdf(visit.visitId, data, operator?.username);
        await addPdfToVisit(visit.uuid, pdf);
        navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visit.uuid}`);
      },
    },
    buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
  };

  return (
    <FormContainer<ValidatedOperatorFormData>
      isLoading={false}
      isError={false}
      buttons={formButtons}
      getFormData={getValidatedOperatorFormData}
    >
      <FormProjectInfo isPhantom />
      <FormProbandInfo isPhantom />
    </FormContainer>
  );
};
