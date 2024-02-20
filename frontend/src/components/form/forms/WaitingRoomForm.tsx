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
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { FormPropType, FormQac, ValidatedOperatorFormData, ValidatedOperatorModifiedFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import { addPdfToVisit, createFinalizedVisit } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState } from "@app/util/mafildb_API/dto";
import {
  fetchWaitingRoomVisitForm,
  generateProbandPdf,
  markVisitFormAsPdfGenerated,
  markVisitFormAsSentToMafilDb,
  sendVisitFormForApproval,
} from "@app/util/server_API/calls";
import { QuestionPartNumber } from "@app/util/server_API/dto";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormFinalizeDialog } from "../components/FormFinalizeDialog";
import { getModifiedFieldsOnly, getValidatedOperatorFormData, isVisitFormForApproval } from "../util/utils";
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
  const { operator } = useAuth();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [areDefaultValuesLoaded, setAreDefaultValuesLoaded] = useState<boolean>(false);
  const [initialFormData, setInitialFormData] = useState<FormPropType>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps<ValidatedOperatorFormData>>();

  // Setting default values
  useEffect(() => {
    if (visitForm !== undefined) {
      setQacs(
        visitForm.answersIncludingQuestions.map((answer, index) => ({
          index,
          questionId: answer.questionId,
          answer: answer.answer,
          comment: answer.comment,
          mustBeApproved: answer.mustBeApproved,
          partNumber: answer.partNumber,
          order: answer.order,
          hiddenByGenders: answer.hiddenByGenders,
          translations: answer.translations,
          updatedAt: answer.updatedAt,
        }))
      );
      const defaultValues = loadFormDefaultValuesFromWaitingRoomVisitForm(visitForm);
      setInitialFormData(defaultValues);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
      setAreDefaultValuesLoaded(true);
    }
  }, [visitForm, setValue]);

  // Setting form buttons
  useEffect(() => {
    if (isEditing) {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.saveChanges",
          onClick: async (_data) => setIsEditing(false),
        },
        buttonsProps: [
          {
            titleLocalizationKey: "form.common.buttons.cancel",
            onClick: async () => {
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
          onClick: async (data) => {
            await createFinalizedVisit(
              data,
              MDB_ApprovalState.DISAPPROVED,
              operator?.username,
              new Date(),
              visitForm?.probandLanguageCode
            );
            // TODO: mark visitForm as DELETED / DISAPPROVED?
            navigate(RoutingPath.WAITING_ROOM);
          },
          showErrorColor: true,
        },
        buttonsProps: [
          {
            titleLocalizationKey: "form.common.buttons.cancel",
            onClick: async () => {
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
          onClick: async (data) => {
            if (isVisitFormForApproval(operator, data)) {
              // open warning dialog that the visit form has to be approved by an operator with higher permissions
              setOpenFinalizeDialog(true);
            } else {
              const visit = await createFinalizedVisit(
                data,
                MDB_ApprovalState.APPROVED,
                operator?.username,
                new Date(),
                visitForm?.probandLanguageCode
              );

              // if something went wrong in the previous finalization, we don't want error to be thrown here if we try to update the already updated state
              if (visitForm?.state !== "SENT_TO_MAFILDB") {
                await markVisitFormAsSentToMafilDb(id);
              }

              const pdf = await generateProbandPdf(
                visit.visitId,
                data,
                operator?.username,
                visitForm?.probandLanguageCode
              );
              await addPdfToVisit(visit.uuid, pdf);
              await markVisitFormAsPdfGenerated(id);
              navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visit.visitId}`);
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
            onClick: async () => {
              setValuesBeforeEditing(getValues());
              setIsEditing(true);
            },
          },
          getBackButtonProps(navigate, "form.common.buttons.cancel"),
        ],
      });
    }
  }, [getValues, id, isDisapproved, isEditing, navigate, operator, setValue, trigger, valuesBeforeEditing, visitForm]);

  const moveVisitFormToApprovalRoom = async (data: ValidatedOperatorFormData) => {
    const modifiedFields: ValidatedOperatorModifiedFormData = {
      ...(getModifiedFieldsOnly(initialFormData, data) ?? {}),
      device: data.device,
      project: data.project,
      measuredAt: data.measuredAt,
      disapprovalReason: data.disapprovalReason,
    };
    await sendVisitFormForApproval(id ?? "", modifiedFields, operator?.id ?? "");
    void queryClient.invalidateQueries({ queryKey: ["waitingRoomVisitForms"], exact: true });
    setOpenFinalizeDialog(false);
    navigate(RoutingPath.WAITING_ROOM);
  };

  return (
    <FormContainer<ValidatedOperatorFormData>
      isLoading={isLoading || !areDefaultValuesLoaded}
      isError={isError}
      buttons={formButtons}
      getFormData={getValidatedOperatorFormData}
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
