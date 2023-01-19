import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@components/form/components/FormButtons";
import { FormProbandContact } from "@components/form/components/FormProbandContact";
import { FormProbandInfo } from "@components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@components/form/components/FormProjectInfo";
import { FormQuestions } from "@components/form/components/FormQuestions";
import { loadFormDefaultValuesFromVisit } from "@components/form/util/loaders";
import { useAuth } from "@hooks/auth/auth";
import { FormPropType, FormQac } from "@interfaces/form";
import { QuestionPartNumber } from "@interfaces/question";
import { VisitState } from "@interfaces/visit";
import { RoutingPaths } from "@routing-paths";
import { fetchVisit } from "@util/fetch";
import { updateDummyVisitState } from "@util/fetch.dev";
import { getBackButtonProps } from "@util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormContainer } from "./FormContainer";

export const ApprovalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { reset, setValue, trigger } = useFormContext<FormPropType>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  // TODO: use MUI Skeleton while data is fetching/loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedVisit = id === undefined ? undefined : await fetchVisit(id);

        // visit not found
        if (fetchedVisit === undefined) {
          setIsError(true);
          return;
        }

        // unauthorized access
        if (operator === undefined) {
          // TODO
          setIsError(true);
          return;
        }

        setQacs(fetchedVisit.answers.map((answer, index) => ({ index, ...answer })));

        const defaultValues = loadFormDefaultValuesFromVisit(fetchedVisit);
        type DefaultValuesPropertyType = keyof typeof defaultValues;
        Object.keys(defaultValues).forEach((propertyName) => {
          setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
        });

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id, operator, setValue]);

  useEffect(() => {
    if (operator?.hasHigherPermission) {
      if (isEditing) {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.saveChanges",
            onClick: (data: FormPropType) => {
              // TODO: save the changes in DB
              setIsEditing(false);
            },
          },
          buttonsProps: [
            {
              titleLocalizationKey: "form.common.buttons.cancel",
              onClick: () => {
                // TODO: reset to previously saved data
                reset();
                setIsEditing(false);
              },
            },
          ],
        });
      } else if (isDisapproved) {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.confirmDisapproval",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.DISAPPROVED);
              navigate(RoutingPaths.APPROVAL_ROOM);
            },
            showErrorColor: true,
          },
          buttonsProps: [
            {
              titleLocalizationKey: "form.common.buttons.cancel",
              onClick: () => {
                setValue("disapprovalReason", null);
                setIsDisapproved(false);
              },
            },
          ],
        });
      } else {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.approve",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.APPROVED);
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${id}`);
            },
          },
          buttonsProps: [
            {
              titleLocalizationKey: "form.common.buttons.disapprove",
              onClick: async () => {
                if (await trigger(undefined, { shouldFocus: true })) {
                  setValue("disapprovalReason", "");
                  setIsDisapproved(true);
                }
              },
              showErrorColor: true,
            },
            {
              titleLocalizationKey: "form.common.buttons.edit",
              onClick: () => setIsEditing(true),
            },
            getBackButtonProps(navigate),
          ],
        });
      }
    } else {
      setFormButtons({
        submitButtonProps: undefined,
        // Even though it's the only button, it doesn't have 'submit' type because MUI uses <span> for buttons
        buttonsProps: [getBackButtonProps(navigate)],
      });
    }
  }, [id, isDisapproved, isEditing, navigate, operator?.hasHigherPermission, reset, setValue]);

  return (
    <FormContainer
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo disableInputs={!isEditing} />
      <FormProbandInfo disableInputs={!isEditing} />
      <FormProbandContact disableInputs={!isEditing} />
      <FormQuestions
        titleLocalizationKey="titlePart1"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.ONE)}
        disableInputs={!isEditing}
        disableComment={!operator?.hasHigherPermission || isDisapproved}
      />
      <FormQuestions
        titleLocalizationKey="titlePart2"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.TWO)}
        disableInputs={!isEditing}
        disableComment={!operator?.hasHigherPermission || isDisapproved}
      />
      {isDisapproved && <FormDisapprovalReason />}
    </FormContainer>
  );
};
