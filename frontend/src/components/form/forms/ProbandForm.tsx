import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormBeforeExamination } from "@app/components/form/components/FormBeforeExamination";
import type { FormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormEntryInfo } from "@app/components/form/components/FormEntryInfo";
import { FormExaminationConsent } from "@app/components/form/components/FormExaminationConsent";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { FormSafetyInfo } from "@app/components/form/components/FormSafetyInfo";
import type { FormQac, ValidatedProbandFormData } from "@app/model/form";
import { fetchCurrentQuestions } from "@app/util/server_API/calls";
import { getValidatedProbandFormData } from "../util/utils";
import { FormContainer } from "./FormContainer";
import { ProbandFormContacts } from "./ProbandFormContacts";

type ProbandFormStep = "examination" | "contacts";

export const ProbandForm = () => {
  const [step, setStep] = useState<ProbandFormStep>("examination");
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<FormButtonsProps<ValidatedProbandFormData>>();

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentQuestions"],
    queryFn: fetchCurrentQuestions,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Setting questions
  useEffect(() => {
    if (questions && step === "examination") {
      setQacs(
        questions.map((question, index) => ({
          index,
          questionId: question.id,
          answer: null,
          comment: "",
          mustBeApproved: question.mustBeApproved,
          partNumber: question.partNumber,
          order: question.order,
          hiddenByGenders: question.hiddenByGenders,
          translations: question.translations,
          updatedAt: question.updatedAt,
        }))
      );
    }
  }, [questions, step]);

  // Setting form buttons
  useEffect(() => {
    if (step === "examination") {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.agree",
          onClick: async () => setStep("contacts"),
        },
        buttonsProps: [],
      });
    }
  }, [step]);

  return (
    <FormContainer
      isLoading={isLoading}
      isError={isError}
      buttons={formButtons}
      getFormData={getValidatedProbandFormData}
    >
      {step === "examination" && (
        <>
          <FormEntryInfo />
          <FormProbandInfo />
          <FormSafetyInfo />
          <FormQuestions
            titleLocalizationKey="title"
            qacs={qacs}
            disableInputs={false}
          />
          <FormBeforeExamination />
          <FormExaminationConsent />
        </>
      )}
      {step === "contacts" && <ProbandFormContacts setFormButtons={setFormButtons} />}
    </FormContainer>
  );
};
