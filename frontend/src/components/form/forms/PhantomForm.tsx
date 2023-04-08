import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { createNewVisitFromFormData } from "@app/components/form/util/utils.dev";
import { dummyVisits } from "@app/data/visit_data";
import { FormPropType } from "@app/model/form";
import { VisitStateDEV } from "@app/model/visit";
import { RoutingPaths } from "@app/routing-paths";
import { getBackButtonProps } from "@app/util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: async (data: FormPropType) => {
        // TODO: create PHANTOM_DONE visit in the MAFILDB
        const newPhantomVisit = createNewVisitFromFormData(data, VisitStateDEV.SIGNED);
        dummyVisits.push(newPhantomVisit);
        navigate(`${RoutingPaths.RECENT_VISITS}/visit/${newPhantomVisit.id}`);
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
