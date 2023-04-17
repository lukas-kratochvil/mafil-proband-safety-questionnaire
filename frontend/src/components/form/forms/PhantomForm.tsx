import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { useAuthDev } from "@app/hooks/auth/auth-dev";
import { FormPropType } from "@app/model/form";
import { RoutingPaths } from "@app/routing-paths";
import { VisitState } from "@app/util/mafildb_API/dto";
import { createVisit } from "@app/util/mafildb_API/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();
  const { operator } = useAuthDev();

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: async (data: FormPropType) => {
        const visitId = await createVisit(data, VisitState.PHANTOM_DONE, operator?.uco, new Date());
        // TODO: generate PDF and send it to MAFILDB
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
