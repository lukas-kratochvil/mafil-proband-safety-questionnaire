import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesFromWaitingRoomVisitForm } from "@app/components/form/util/loaders";
import { useAuth } from "@app/hooks/auth/auth";
import { FormPropType, FormQac } from "@app/interfaces/form";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, VisitStateDEV } from "@app/interfaces/visit";
import { RoutingPaths } from "@app/routing-paths";
import { updateDummyVisitState } from "@app/util/fetch.dev";
import { fetchWaitingRoomVisitForm } from "@app/util/server_API/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormFinalizeDialog } from "../components/FormFinalizeDialog";
import { FormContainer } from "./FormContainer";

export const WaitingRoomForm = () => {
  const { id } = useParams();
  const {
    data: visit,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["visitForm", id], queryFn: () => fetchWaitingRoomVisitForm(id) });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  useEffect(() => {
    if (visit !== undefined) {
      // TODO: try if there's a need for isLoading flag due to the slow form initialization
      const defaultValues = loadFormDefaultValuesFromWaitingRoomVisitForm(visit);
      setQacs(defaultValues.answers.map((answer, index) => ({ index, ...answer })));
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
    }
  }, [visit, setValue]);

  useEffect(() => {
    if (isEditing) {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.saveChanges",
          onClick: async (_data: FormPropType) => setIsEditing(false),
        },
        buttonsProps: [
          {
            titleLocalizationKey: "form.common.buttons.cancel",
            onClick: () => {
              if (valuesBeforeEditing !== undefined) {
                type ValuesBeforeEditingType = keyof typeof valuesBeforeEditing;
                Object.keys(valuesBeforeEditing).forEach((propertyName) => {
                  setValue(
                    propertyName as ValuesBeforeEditingType,
                    valuesBeforeEditing[propertyName as ValuesBeforeEditingType]
                  );
                });
                setIsEditing(false);
              }
            },
          },
        ],
      });
    } else if (isDisapproved) {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.confirmDisapproval",
          onClick: async (data: FormPropType) => {
            // TODO: create DISAPPROVED visit in the MAFILDB
            updateDummyVisitState(id, VisitStateDEV.DISAPPROVED);
            navigate(RoutingPaths.WAITING_ROOM);
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
          titleLocalizationKey: "form.common.buttons.finalize",
          onClick: async (data: FormPropType) => {
            if (
              operator?.role === "MR_HIGH_PERM"
              || data.answers.find(
                (answer) => answer.partNumber === QuestionPartNumber.TWO && answer.answer === AnswerOption.YES
              ) === undefined
            ) {
              // TODO: create APPROVED visit in the MAFILDB
              updateDummyVisitState(id, VisitStateDEV.APPROVED);
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${id}`);
            } else {
              // open warning dialog that the visit form has to be approved by an operator with higher permissions
              setOpenFinalizeDialog(true);
            }
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
            onClick: () => {
              setValuesBeforeEditing(getValues());
              setIsEditing(true);
            },
          },
          getBackButtonProps(navigate, "form.common.buttons.cancel"),
        ],
      });
    }
  }, [getValues, id, isDisapproved, isEditing, navigate, operator?.role, setValue, trigger, valuesBeforeEditing]);

  const moveVisitFormToApprovalRoom = async (data: FormPropType) => {
    // TODO: update visit with IN_APPROVAL state in the server DB
    updateDummyVisitState(id, VisitStateDEV.IN_APPROVAL);
    setOpenFinalizeDialog(false);
    navigate(RoutingPaths.WAITING_ROOM);
  };

  return (
    <FormContainer
      isLoading={isLoading}
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo />
      <FormProbandInfo disableInputs={!isEditing} />
      <FormProbandContact disableInputs={!isEditing} />
      <FormQuestions
        titleLocalizationKey="titlePart1"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.ONE)}
        disableInputs={!isEditing}
      />
      <FormQuestions
        titleLocalizationKey="titlePart2"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.TWO)}
        disableInputs={!isEditing}
      />
      {isDisapproved && <FormDisapprovalReason />}
      <FormFinalizeDialog
        isOpen={openFinalizeDialog}
        setIsOpen={setOpenFinalizeDialog}
        onContinue={moveVisitFormToApprovalRoom}
      />
    </FormContainer>
  );
};
