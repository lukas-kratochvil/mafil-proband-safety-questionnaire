import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { UrlBasePaths } from "../../App";
import { IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandContact } from "../../components/form/FormProbandContact";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { FormQac } from "../../components/form/FormQuestion";
import { FormQuestions } from "../../components/form/FormQuestions";
import { FormPropType } from "../../components/form/types/types";
import { getDisapproveButtonProps, loadFormDefaultValuesFromVisit } from "../../components/form/util/utils";
import { QuestionPartNumber } from "../../data/question_data";
import { VisitState } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchVisit } from "../../util/fetch";
import { updateDummyVisitState } from "../../util/fetch.dev";
import { getBackButtonProps } from "../../util/utils";
import { FormContainer } from "./FormContainer";

export const ApprovalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { reset, setValue } = useFormContext<FormPropType>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  // TODO: use MUI Skeleton while data is fetching/loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedVisit = id === undefined ? undefined : await fetchVisit(id);

        if (fetchedVisit === undefined) {
          console.log("VISIT NOT FOUND!");
          setIsError(true);
          return;
        }

        if (operator === undefined) {
          // TODO
          console.log("UNAUTHORIZED ACCESS!");
          setIsError(true);
          return;
        }

        console.log("FETCHING QUESTIONS FROM THE VISIT");
        setQacs(fetchedVisit.answers.map((answer, index) => ({ index, ...answer })));

        console.log("SETTING DEFAULT VALUES");
        const defaultValues = loadFormDefaultValuesFromVisit(fetchedVisit);
        type DefaultValuesPropertyType = keyof typeof defaultValues;
        Object.keys(defaultValues).forEach((propertyName) => {
          setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
          console.log(
            "-->",
            propertyName as DefaultValuesPropertyType,
            ":",
            defaultValues[propertyName as DefaultValuesPropertyType]
          );
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
      } else {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.approve",
            onClick: () => {
              // TODO: store changes in DB if made
              updateDummyVisitState(id, VisitState.APPROVED);
              navigate(`${UrlBasePaths.RECENT_VISITS}/visit/${id}`);
            },
          },
          buttonsProps: [
            getDisapproveButtonProps(id, navigate),
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
  }, [id, isEditing, navigate, operator?.hasHigherPermission, reset]);

  return (
    <FormContainer
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo disableInputs={!isEditing} />
      <FormProbandInfo disableInputs={!isEditing} />
      <FormProbandContact disableInputs={!isEditing} />
      <FormQuestions
        title="Část 1"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.ONE)}
        disableInputs={!isEditing}
        disableComment={!operator?.hasHigherPermission}
      />
      <FormQuestions
        title="Část 2"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.TWO)}
        disableInputs={!isEditing}
        disableComment={!operator?.hasHigherPermission}
      />
    </FormContainer>
  );
};