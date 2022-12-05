import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormBeforeExamination } from "@components/form/components/FormBeforeExamination";
import { IFormButtonsProps } from "@components/form/components/FormButtons";
import { FormEntryInfo } from "@components/form/components/FormEntryInfo";
import { FormExaminationConsent } from "@components/form/components/FormExaminationConsent";
import { FormProbandContact } from "@components/form/components/FormProbandContact";
import { FormProbandInfo } from "@components/form/components/FormProbandInfo";
import { FormQuestions } from "@components/form/components/FormQuestions";
import { FormSafetyInfo } from "@components/form/components/FormSafetyInfo";
import { FormPropType, FormQac } from "@interfaces/form";
import { RoutingPaths } from "@routing-paths";
import { fetchCurrentQuestions } from "@util/fetch";
import { FormContainer } from "./FormContainer";

export const ProbandForm = () => {
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
        navigate(RoutingPaths.PROBAND_HOME);
      },
    },
    buttonsProps: [],
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
