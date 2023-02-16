import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { FormBeforeExamination } from "@components/form/components/FormBeforeExamination";
import { IFormButtonsProps } from "@components/form/components/FormButtons";
import { FormEntryInfo } from "@components/form/components/FormEntryInfo";
import { FormExaminationConsent } from "@components/form/components/FormExaminationConsent";
import { FormProbandInfo } from "@components/form/components/FormProbandInfo";
import { FormQuestions } from "@components/form/components/FormQuestions";
import { FormSafetyInfo } from "@components/form/components/FormSafetyInfo";
import { FormPropType, FormQac } from "@interfaces/form";
import { RoutingPaths } from "@routing-paths";
import { fetchCurrentQuestions } from "@util/fetch";
import { FormProbandContactCheckbox } from "../components/FormProbandContactCheckbox";
import { FormProbandContactConsent } from "../components/FormProbandContactConsent";
import { FormProbandContactRequest } from "../components/FormProbandContactRequest";
import { FormContainer } from "./FormContainer";

enum ProbandFormStep {
  EXAMINATION,
  CONTACTS,
}

export const ProbandForm = () => {
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery("currentQuestions", async () => fetchCurrentQuestions());
  const navigate = useNavigate();
  const { setError, setValue } = useFormContext<FormPropType>();

  const [step, setStep] = useState<ProbandFormStep>(ProbandFormStep.EXAMINATION);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [isContactsRequestShown, setIsContactsRequestShown] = useState<boolean>(false);

  const contactsButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.complete",
      onClick: (data: FormPropType) => {
        // TODO: create visit in DB
        navigate(RoutingPaths.PROBAND_HOME);
      },
    },
    buttonsProps: [],
  };

  const contactsRequestButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.agree",
      onClick: (data: FormPropType) => {
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
          // TODO: create visit in DB
          navigate(RoutingPaths.PROBAND_HOME);
        }
      },
    },
    buttonsProps: [],
  };

  const examinationButtons: IFormButtonsProps = {
    submitButtonProps: {
      titleLocalizationKey: "form.common.buttons.agree",
      onClick: () => {
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
        questions.map((qac, index) => ({
          index,
          questionId: qac.id,
          partNumber: qac.partNumber,
          answer: null,
          comment: "",
        }))
      );
    }
  }, [questions, step]);

  useEffect(() => {
    if (step === ProbandFormStep.EXAMINATION) {
      setValue("answers", qacs);
    }
  }, [qacs, setValue, step]);

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
