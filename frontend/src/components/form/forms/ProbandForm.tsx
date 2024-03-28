import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormBeforeExamination } from "@app/components/form/components/FormBeforeExamination";
import type { FormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormEntryInfo } from "@app/components/form/components/FormEntryInfo";
import { FormExaminationConsent } from "@app/components/form/components/FormExaminationConsent";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { FormSafetyInfo } from "@app/components/form/components/FormSafetyInfo";
import type { FormPropType, FormQac, ValidatedProbandFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import { createProbandVisitForm, fetchCurrentQuestions } from "@app/util/server_API/calls";
import { FormProbandContactCheckbox } from "../components/FormProbandContactCheckbox";
import { FormProbandContactConsent } from "../components/FormProbandContactConsent";
import { FormProbandContactRequest } from "../components/FormProbandContactRequest";
import { getValidatedProbandFormData } from "../util/utils";
import { FormContainer } from "./FormContainer";

type ProbandFormStep = "examination" | "contacts";

export const ProbandForm = () => {
  const navigate = useNavigate();
  const { setError } = useFormContext<FormPropType>();

  const [step, setStep] = useState<ProbandFormStep>("examination");
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<FormButtonsProps<ValidatedProbandFormData>>();
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

  // Setting questions
  useEffect(() => {
    if (questions !== undefined && step === "examination") {
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
    } else if (step === "contacts") {
      if (isContactsRequestShown) {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.agree",
            onClick: async (data) => {
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
                await createProbandVisitForm(data);
                navigate(RoutingPath.PROBAND_HOME);
              }
            },
          },
          buttonsProps: [],
        });
      } else {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.complete",
            onClick: async (data) => {
              await createProbandVisitForm(data);
              navigate(RoutingPath.PROBAND_HOME);
            },
          },
          buttonsProps: [],
        });
      }
    }
  }, [isContactsRequestShown, navigate, setError, step]);

  return (
    <FormContainer<ValidatedProbandFormData>
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
      {step === "contacts" && (
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
