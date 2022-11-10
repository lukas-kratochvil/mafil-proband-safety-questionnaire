import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../App";
import { FormBeforeExamination } from "../../components/form/FormBeforeExamination";
import { IFormButtonsProps } from "../../components/form/FormButtons";
import { FormEntryInfo } from "../../components/form/FormEntryInfo";
import { FormExaminationConsent } from "../../components/form/FormExaminationConsent";
import { FormProbandContact } from "../../components/form/FormProbandContact";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormQac } from "../../components/form/FormQuestion";
import { FormQuestions } from "../../components/form/FormQuestions";
import { FormSafetyInfo } from "../../components/form/FormSafetyInfo";
import { FormPropType } from "../../interfaces/form";
import { fetchCurrentQuestions } from "../../util/fetch";
import { FormContainer } from "./FormContainer";

export const ProbandFormPage = () => {
  const navigate = useNavigate();
  const { setValue } = useFormContext();

  const [qacs, setQacs] = useState<FormQac[]>([]);

  // TODO: use MUI Skeleton while data is fetching/loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const formButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.agree",
      onClick: (data: FormPropType) => {
        // TODO: create visit in DB
        navigate(UrlBasePaths.PROBAND_HOME);
      },
    },
    buttonsProps: [],
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
            answer: null,
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
      <FormEntryInfo />
      <FormProbandInfo />
      <FormProbandContact />
      <FormSafetyInfo />
      <FormQuestions
        titleLocalizationKey="title"
        qacs={qacs}
        disableInputs={false}
      />
      <FormBeforeExamination />
      <FormExaminationConsent />
    </FormContainer>
  );
};
