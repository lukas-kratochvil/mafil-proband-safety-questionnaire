import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesFromWaitingRoomVisitForm } from "@app/components/form/util/loaders";
import { useAuthDev } from "@app/hooks/auth/auth-dev";
import { FormPropType, FormQac } from "@app/model/form";
import { RoutingPaths } from "@app/routing-paths";
import { VisitState } from "@app/util/mafildb_API/dto";
import { createVisit } from "@app/util/mafildb_API/fetch";
import { QuestionPartNumber } from "@app/util/server_API/dto";
import {
  fetchWaitingRoomVisitForm,
  markVisitFormAsSentToMafilDb,
  sendVisitFormForApproval,
} from "@app/util/server_API/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormFinalizeDialog } from "../components/FormFinalizeDialog";
import { getModifiedFieldsOnly, isVisitFormForApproval } from "../util/utils";
import { FormContainer } from "./FormContainer";

export const WaitingRoomForm = () => {
  const { id } = useParams();
  const {
    data: visitForm,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["visitForm", id],
    queryFn: () => fetchWaitingRoomVisitForm(id),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { operator } = useAuthDev();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [initialFormData, setInitialFormData] = useState<FormPropType>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  useEffect(() => {
    if (visitForm !== undefined) {
      setQacs(visitForm.answersIncludingQuestions.map((answer, index) => ({ ...answer, index })));
      // TODO: try if there's a need for isLoading flag due to the slow form initialization
      const defaultValues = loadFormDefaultValuesFromWaitingRoomVisitForm(visitForm);
      setInitialFormData(defaultValues);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
    }
  }, [visitForm, setValue]);

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
            await createVisit(data, VisitState.DISAPPROVED, operator?.uco, new Date(), visitForm?.probandLanguageCode);
            await markVisitFormAsSentToMafilDb(visitForm?.id || "");
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
            if (isVisitFormForApproval(operator, data)) {
              // open warning dialog that the visit form has to be approved by an operator with higher permissions
              setOpenFinalizeDialog(true);
            } else {
              const visitId = await createVisit(
                data,
                VisitState.APPROVED,
                operator?.uco,
                new Date(),
                visitForm?.probandLanguageCode
              );
              await markVisitFormAsSentToMafilDb(visitForm?.id || "");
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${visitId}`);
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
  }, [
    getValues,
    isDisapproved,
    isEditing,
    navigate,
    operator,
    setValue,
    trigger,
    valuesBeforeEditing,
    visitForm?.id,
    visitForm?.probandLanguageCode,
  ]);

  const moveVisitFormToApprovalRoom = async (data: FormPropType) => {
    const modifiedFields: Partial<FormPropType> = {
      ...getModifiedFieldsOnly(initialFormData, data),
      device: {
        id: data.device?.id ?? "",
        name: data.device?.name ?? "",
      },
      project: {
        id: data.project?.id ?? "",
        acronym: data.project?.acronym ?? "",
        name: data.project?.name ?? "",
      },
      measuredAt: data.measuredAt ?? new Date(),
    };
    await sendVisitFormForApproval(id || "", modifiedFields, operator?.id || "");
    queryClient.invalidateQueries({ queryKey: ["waitingRoomVisitForms"], exact: true });
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
