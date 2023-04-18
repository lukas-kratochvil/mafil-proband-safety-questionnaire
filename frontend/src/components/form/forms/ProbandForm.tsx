import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormBeforeExamination } from "@app/components/form/components/FormBeforeExamination";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormEntryInfo } from "@app/components/form/components/FormEntryInfo";
import { FormExaminationConsent } from "@app/components/form/components/FormExaminationConsent";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { FormSafetyInfo } from "@app/components/form/components/FormSafetyInfo";
import { FormPropType, FormQac } from "@app/model/form";
import { RoutingPaths } from "@app/routing-paths";
import { createProbandVisitForm, fetchCurrentQuestions } from "@app/util/server_API/fetch";
import { FormProbandContactCheckbox } from "../components/FormProbandContactCheckbox";
import { FormProbandContactConsent } from "../components/FormProbandContactConsent";
import { FormProbandContactRequest } from "../components/FormProbandContactRequest";
import { FormContainer } from "./FormContainer";

enum ProbandFormStep {
  EXAMINATION,
  CONTACTS,
}

export const ProbandForm = () => {
  const navigate = useNavigate();
  const { setError, setValue } = useFormContext<FormPropType>();

  const [step, setStep] = useState<ProbandFormStep>(ProbandFormStep.EXAMINATION);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [isContactsRequestShown, setIsContactsRequestShown] = useState<boolean>(false);

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentQuestions"],
    queryFn: fetchCurrentQuestions,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const contactsButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.complete",
      onClick: async (data: FormPropType) => {
        createProbandVisitForm(data);
        navigate(RoutingPaths.PROBAND_HOME);
      },
    },
    buttonsProps: [],
  };

  const contactsRequestButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.agree",
      onClick: async (data: FormPropType) => {
        let isValidationError = false;

        if (data.email === "") {
          setError("email", { message: "form.validation.probandContacts" }, { shouldFocus: true });
          isValidationError = true;
        }
        if (data.phone === "") {
          setError("phone", { message: "form.validation.probandContacts" }, { shouldFocus: !isValidationError });
          isValidationError = true;
        }

        if (!isValidationError) {
          createProbandVisitForm(data);
          navigate(RoutingPaths.PROBAND_HOME);
        }
      },
    },
    buttonsProps: [],
  };

  const examinationButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.agree",
      onClick: async () => {
        setStep(ProbandFormStep.CONTACTS);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setFormButtons(contactsButtons);
      },
    },
    buttonsProps: [],
  };

  const [formButtons, setFormButtons] = useState<IFormButtonsProps>(examinationButtons);

  useEffect(() => {
    if (questions !== undefined && step === ProbandFormStep.EXAMINATION) {
      setQacs(
        questions.map((question, index) => ({
          index,
          questionId: question.id,
          answer: null,
          comment: "",
          hiddenByGenders: question.hiddenByGenders,
          mustBeApproved: question.mustBeApproved,
          partNumber: question.partNumber,
          translations: question.translations,
          updatedAt: question.updatedAt,
        }))
      );
    }
  }, [questions, step]);

  useEffect(() => {
    if (step === ProbandFormStep.CONTACTS) {
      setFormButtons(isContactsRequestShown ? contactsRequestButtons : contactsButtons);
    }
  }, [isContactsRequestShown, step]);

  return (
    <FormContainer
      isLoading={isLoading}
      isError={isError}
      buttons={formButtons}
    >
      {step === ProbandFormStep.EXAMINATION && (
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
      {step === ProbandFormStep.CONTACTS && (
        <>
          <FormProbandContactCheckbox setIsContactsRequestShown={setIsContactsRequestShown} />
          {isContactsRequestShown && (
            <>
              <FormProbandContactRequest />
              <FormProbandContactConsent />
            </>
          )}
        </>
      )}
    </FormContainer>
  );
};
