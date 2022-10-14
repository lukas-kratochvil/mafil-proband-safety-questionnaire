import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "../../components/form/FormButtons";
import { FormProbandContact } from "../../components/form/FormProbandContact";
import { FormProbandInfo } from "../../components/form/FormProbandInfo";
import { FormProjectInfo } from "../../components/form/FormProjectInfo";
import { FormQac } from "../../components/form/FormQuestion";
import { FormQuestions } from "../../components/form/FormQuestions";
import { FormPropType } from "../../components/form/types/types";
import {
  createNewVisitFromFormData,
  getDisapproveButtonProps,
  loadFormDefaultValuesVisitDuplication,
} from "../../components/form/util/utils";
import { QuestionPartNumber } from "../../data/question_data";
import { AnswerOption, dummyVisits, VisitState } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { fetchVisit } from "../../util/fetch";
import { getBackButtonProps } from "../../util/utils";
import { FormContainer } from "./FormContainer";

export const DuplicationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { reset, setValue } = useFormContext();

  const [isFantom, setIsFantom] = useState<boolean>(false);
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
        const defaultValues = loadFormDefaultValuesVisitDuplication(fetchedVisit);
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

        setIsFantom(fetchedVisit.projectInfo.isFantom);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchData();
  }, [id, operator, setValue]);

  useEffect(() => {
    if (isFantom) {
      setFormButtons({
        submitButtonProps: {
          title: "Finalizovat",
          onClick: (data: FormPropType) => {
            // TODO: create fantom visit in DB
            const newFantomVisit = createNewVisitFromFormData(data, VisitState.SIGNED);
            dummyVisits.push(newFantomVisit);
            navigate(`/auth/recent-visits/visit/${newFantomVisit.id}`);
          },
        },
        buttonsProps: [getBackButtonProps(navigate, "Zrušit")],
      });
    } else if (isEditing) {
      setFormButtons({
        submitButtonProps: {
          title: "Uložit změny",
          onClick: (data: FormPropType) => {
            // TODO: save the changes in DB
            setIsEditing(false);
          },
        },
        buttonsProps: [
          {
            title: "Zrušit",
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
          title: "Finalizovat",
          onClick: (data: FormPropType) => {
            // TODO: store changes in DB if made
            const isApproved
              = operator?.hasHigherPermission
              || data.answers.find(
                (answer) => answer.partNumber === QuestionPartNumber.TWO && answer.answer === AnswerOption.YES
              ) === undefined;
            const newVisit = createNewVisitFromFormData(
              data,
              isApproved ? VisitState.APPROVED : VisitState.IN_APPROVAL
            );
            dummyVisits.push(newVisit);

            if (isApproved) {
              navigate(`/auth/recent-visits/visit/${newVisit.id}`);
            } else {
              navigate("/auth/recent-visits");
            }
          },
        },
        buttonsProps: [
          getDisapproveButtonProps(id, navigate),
          {
            title: "Editovat",
            onClick: () => setIsEditing(true),
          },
          getBackButtonProps(navigate, "Zrušit"),
        ],
      });
    }
  }, [id, isEditing, isFantom, navigate, operator?.hasHigherPermission, reset]);

  return (
    <FormContainer
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo isFantom={isFantom} />
      <FormProbandInfo
        isFantom={isFantom}
        disableInputs={!isEditing}
      />
      {!isFantom && (
        <>
          <FormProbandContact disableInputs={!isEditing} />
          <FormQuestions
            title="Část 1"
            qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.ONE)}
            disableInputs={!isEditing}
          />
          <FormQuestions
            title="Část 2"
            qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.TWO)}
            disableInputs={!isEditing}
          />
        </>
      )}
    </FormContainer>
  );
};
