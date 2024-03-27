import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { type IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesFromApprovalRoomVisitForm } from "@app/components/form/util/loaders";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import type { FormPropType, FormQac, ValidatedOperatorFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import { addPdfToVisit, createVisitFromApproval } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState } from "@app/util/mafildb_API/dto";
import {
  fetchApprovalRoomVisitForm,
  generateProbandPdf,
  markVisitFormAsPdfGenerated,
  markVisitFormAsSentToMafilDb,
} from "@app/util/server_API/calls";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { getValidatedOperatorFormData } from "../util/utils";
import { FormContainer } from "./FormContainer";

export const ApprovalRoomForm = () => {
  const { id } = useParams();
  const {
    data: visitForm,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["visitForm", id],
    queryFn: () => fetchApprovalRoomVisitForm(id),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [areDefaultValuesLoaded, setAreDefaultValuesLoaded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
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
      const defaultValues = loadFormDefaultValuesFromApprovalRoomVisitForm(visitForm);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
      setAreDefaultValuesLoaded(true);
    }
  }, [visitForm, setValue]);

  // Setting form buttons
  useEffect(() => {
    if (operator?.role === "MR_HIGH_PERM") {
      if (isEditing) {
        setFormButtons({
          submitButtonProps: {
            titleLocalizationKey: "form.common.buttons.saveChanges",
            onClick: async (_data: ValidatedOperatorFormData) => setIsEditing(false),
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
              await createVisitFromApproval(
                data,
                MDB_ApprovalState.DISAPPROVED,
                visitForm?.additionalInfo.finalizer.username,
                visitForm?.additionalInfo.finalizedAt,
                visitForm?.probandLanguageCode,
                operator?.username,
                new Date()
              );
              // TODO: mark visitForm as DELETED / DISAPPROVED?
              navigate(RoutingPath.APPROVAL_ROOM);
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
            titleLocalizationKey: "form.common.buttons.approve",
            onClick: async (data) => {
              const visit = await createVisitFromApproval(
                data,
                MDB_ApprovalState.APPROVED,
                visitForm?.additionalInfo.finalizer.username,
                visitForm?.additionalInfo.finalizedAt,
                visitForm?.probandLanguageCode,
                operator.username,
                new Date()
              );

              // if something went wrong in the previous finalization, we don't want error to be thrown here if we try to update the already updated state
              if (visitForm?.state !== "SENT_TO_MAFILDB") {
                await markVisitFormAsSentToMafilDb(id);
              }

              const pdf = await generateProbandPdf(
                visit.visitId,
                data,
                visitForm?.additionalInfo.finalizer.username,
                visitForm?.probandLanguageCode,
                operator.username
              );
              await addPdfToVisit(visit.uuid, pdf);
              await markVisitFormAsPdfGenerated(id);
              navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visit.visitId}`);
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
            getBackButtonProps(navigate),
          ],
        });
      }
    } else {
      setFormButtons({
        submitButtonProps: undefined,
        // Even though the 'Back button' is the only button in the form, it doesn't have 'submit' type because MUI uses HTML span element for buttons
        buttonsProps: [getBackButtonProps(navigate)],
      });
    }
  }, [getValues, id, isDisapproved, isEditing, navigate, operator, setValue, trigger, valuesBeforeEditing, visitForm]);

  return (
    <FormContainer<ValidatedOperatorFormData>
      isLoading={isLoading || !areDefaultValuesLoaded}
      isError={isError}
      buttons={formButtons}
      getFormData={getValidatedOperatorFormData}
    >
      <FormProjectInfo disableInputs={!isEditing} />
      <FormProbandInfo disableInputs={!isEditing} />
      <FormProbandContact disableInputs={!isEditing} />
      <FormQuestions
        titleLocalizationKey="titlePart1"
        qacs={qacs.filter((qac) => qac.partNumber === 1)}
        disableInputs={!isEditing}
        disableComment={operator?.role !== "MR_HIGH_PERM" || isDisapproved}
      />
      <FormQuestions
        titleLocalizationKey="titlePart2"
        qacs={qacs.filter((qac) => qac.partNumber === 2)}
        disableInputs={!isEditing}
        disableComment={operator?.role !== "MR_HIGH_PERM" || isDisapproved}
      />
      {isDisapproved && <FormDisapprovalReason />}
    </FormContainer>
  );
};
