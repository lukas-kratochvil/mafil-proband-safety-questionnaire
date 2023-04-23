import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { useAuthDev } from "@app/hooks/auth/auth-dev";
import { RoutingPaths } from "@app/routing-paths";
import { VisitState } from "@app/util/mafildb_API/dto";
import { createVisit } from "@app/util/mafildb_API/fetch";
import { generatePhantomPdf } from "@app/util/server_API/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();
  const { operator } = useAuthDev();

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: async (data) => {
        const visitId = await createVisit(data, VisitState.PHANTOM_DONE, operator?.uco, new Date());
        const pdf = await generatePhantomPdf(visitId, data, operator?.uco);
        navigate(`${RoutingPaths.RECENT_VISITS}/visit/${visitId}`);
      },
    },
    buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
  };

  return (
    <FormContainer
      isLoading={false}
      isError={false}
      buttons={formButtons}
    >
      <FormProjectInfo isPhantom />
      <FormProbandInfo isPhantom />
    </FormContainer>
  );
};
