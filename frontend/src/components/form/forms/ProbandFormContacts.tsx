import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { FormPropType, ValidatedProbandFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import { createProbandVisitForm } from "@app/util/server_API/calls";
import type { FormButtonsProps } from "../components/FormButtons";
import { FormProbandContactCheckbox } from "../components/FormProbandContactCheckbox";
import { FormProbandContactConsent } from "../components/FormProbandContactConsent";
import { FormProbandContactRequest } from "../components/FormProbandContactRequest";

type ProbandFormContactsProps = {
  setFormButtons: Dispatch<SetStateAction<FormButtonsProps<ValidatedProbandFormData> | undefined>>;
};

const ProbandFormContacts = ({ setFormButtons }: ProbandFormContactsProps) => {
  const navigate = useNavigate();
  const { setError } = useFormContext<FormPropType>();

  const [isContactsRequestShown, setIsContactsRequestShown] = useState<boolean>(false);

  // Setting form buttons
  useEffect(() => {
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
  }, [isContactsRequestShown, navigate, setError, setFormButtons]);

  return (
    <>
      <FormProbandContactCheckbox setIsContactsRequestShown={setIsContactsRequestShown} />
      {isContactsRequestShown && (
        <>
          <FormProbandContactRequest />
          <FormProbandContactConsent />
        </>
      )}
    </>
  );
};

export default ProbandFormContacts;
