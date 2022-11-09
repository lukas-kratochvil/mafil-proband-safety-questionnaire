import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../App";
import { IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { FormQac } from "../../components/form/FormQuestion";
import { createNewVisitFromFormData } from "../../components/form/util/utils.dev";
import { dummyVisits } from "../../data/visit_data";
import { FormPropType } from "../../interfaces/form";
import { AnswerOption, VisitState } from "../../interfaces/visit";
import { fetchCurrentQuestions } from "../../util/fetch";
import { getBackButtonProps } from "../../util/utils";
import { FormContainer } from "./FormContainer";

export const PhantomFormPage = () => {
  const navigate = useNavigate();
  const { setValue } = useFormContext();

  const [qacs, setQacs] = useState<FormQac[]>([]);

  // TODO: use MUI Skeleton while data is fetching/loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.finalize",
      onClick: (data: FormPropType) => {
        // TODO: create phantom visit in DB
        const newPhantomVisit = createNewVisitFromFormData(data, VisitState.SIGNED);
        dummyVisits.push(newPhantomVisit);
        navigate(`${UrlBasePaths.RECENT_VISITS}/visit/${newPhantomVisit.id}`);
      },
    },
    buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("FETCHING DEFAULT QUESTIONS");
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
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo isPhantom />
      <FormProbandInfo isPhantom />
    </FormContainer>
  );
};
