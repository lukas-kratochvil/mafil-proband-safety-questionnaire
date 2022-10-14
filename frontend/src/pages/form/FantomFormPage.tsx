import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { FormQac } from "../../components/form/FormQuestion";
import { FormPropType } from "../../components/form/types/types";
import { createNewVisitFromFormData } from "../../components/form/util/utils";
import { AnswerOption, dummyVisits, VisitState } from "../../data/visit_data";
import { fetchCurrentQuestions } from "../../util/fetch";
import { getBackButtonProps } from "../../util/utils";
import { FormContent } from "./FormContent";

export const FantomFormPage = () => {
  const navigate = useNavigate();
  const { setValue } = useFormContext();

  const [qacs, setQacs] = useState<FormQac[]>([]);

  // TODO: use MUI Skeleton while data is fetching/loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      title: "Finalizovat",
      onClick: (data: FormPropType) => {
        // TODO: create fantom visit in DB
        const newFantomVisit = createNewVisitFromFormData(data, VisitState.SIGNED);
        dummyVisits.push(newFantomVisit);
        navigate(`/auth/visit/${newFantomVisit.id}`);
      },
    },
    buttonsProps: [getBackButtonProps(navigate, "Zrušit")],
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
    <FormContent
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo isFantom />
      <FormProbandInfo isFantom />
    </FormContent>
  );
};
