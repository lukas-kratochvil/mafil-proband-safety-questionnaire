import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "@components/form/components/FormButtons";
import { FormProbandInfo } from "@components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@components/form/components/FormProjectInfo";
import { createNewVisitFromFormData } from "@components/form/util/utils.dev";
import { dummyVisits } from "@data/visit_data";
import { FormPropType, FormQac } from "@interfaces/form";
import { AnswerOption, VisitState } from "@interfaces/visit";
import { RoutingPaths } from "@routing-paths";
import { fetchCurrentQuestions } from "@util/fetch";
import { getBackButtonProps } from "@util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomForm = () => {
  const navigate = useNavigate();
  const { setValue } = useFormContext<FormPropType>();

  const [qacs, setQacs] = useState<FormQac[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

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
    const fetchQuestions = async () => {
      try {
        const questions = await fetchCurrentQuestions();
        setQacs(
          questions.map((qac, index) => ({
            index,
            questionId: qac.id,
            partNumber: qac.partNumber,
            answer: AnswerOption.NO,
            comment: "",
          }))
        );
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    setValue("answers", qacs);
  }, [qacs, setValue]);

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
