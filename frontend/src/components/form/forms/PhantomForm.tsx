import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { useAuthDev } from "@app/hooks/auth/auth-dev";
import { RoutingPaths } from "@app/routing-paths";
import { addPdfToVisit, createPhantomVisit } from "@app/util/mafildb_API/calls";
import { generatePhantomPdf } from "@app/util/server_API/calls";
import { getBackButtonProps } from "@app/util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();
  const { operator } = useAuthDev();

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: async (data) => {
        const visitId = await createPhantomVisit(data, operator?.uco, new Date());
        const pdf = await generatePhantomPdf(visitId, data, operator?.uco);
        await addPdfToVisit(visitId, pdf);
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
