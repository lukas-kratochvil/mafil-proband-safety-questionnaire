import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { createNewVisitFromFormData } from "@app/components/form/util/utils.dev";
import { dummyVisits } from "@app/data/visit_data";
import { FormPropType } from "@app/interfaces/form";
import { AnswerOption, VisitState } from "@app/interfaces/visit";
import { RoutingPaths } from "@app/routing-paths";
import { fetchCurrentQuestions } from "@app/util/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentQuestions"],
    queryFn: fetchCurrentQuestions,
  });
  const navigate = useNavigate();
  const { setValue } = useFormContext<FormPropType>();

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: (data: FormPropType) => {
        // TODO: create phantom visit in DB
        const newPhantomVisit = createNewVisitFromFormData(data, VisitState.SIGNED);
        dummyVisits.push(newPhantomVisit);
        navigate(`${RoutingPaths.RECENT_VISITS}/visit/${newPhantomVisit.id}`);
      },
    },
    buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
  };

  useEffect(() => {
    if (questions !== undefined) {
      setValue(
        "answers",
        questions.map((qac, index) => ({
          index,
          questionId: qac.id,
          partNumber: qac.partNumber,
          answer: AnswerOption.NO,
          comment: "",
        }))
      );
    }
  }, [questions, setValue]);

  return (
    <FormContainer
      isLoading={isLoading}
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo isPhantom />
      <FormProbandInfo isPhantom />
    </FormContainer>
  );
};
