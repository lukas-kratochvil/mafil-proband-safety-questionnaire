import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesFromApprovalRoomVisitForm } from "@app/components/form/util/loaders";
import { useAuthDev } from "@app/hooks/auth/auth-dev";
import { FormPropType, FormQac, ValidatedFormData } from "@app/model/form";
import { RoutingPaths } from "@app/routing-paths";
import { addPdfToVisit, createVisitFromApproval } from "@app/util/mafildb_API/calls";
import { VisitState } from "@app/util/mafildb_API/dto";
import {
  fetchApprovalRoomVisitForm,
  generateProbandPdf,
  markVisitFormAsPdfGenerated,
  markVisitFormAsSentToMafilDb,
} from "@app/util/server_API/calls";
import { QuestionPartNumber } from "@app/util/server_API/dto";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
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
  const { operator } = useAuthDev();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [areDefaultValuesLoaded, setAreDefaultValuesLoaded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  // Setting default values
  useEffect(() => {
    if (visitForm !== undefined) {
      setQacs(
        visitForm.answersIncludingQuestions.map((answer, index) => ({
          index,
          questionId: answer.questionId,
          answer: answer.answer,
          comment: answer.comment,
          hiddenByGenders: answer.hiddenByGenders,
          mustBeApproved: answer.mustBeApproved,
          partNumber: answer.partNumber,
          translations: answer.translations,
          updatedAt: answer.updatedAt,
        }))
      );
      // TODO: try if there's a need for isLoading flag due to the slow form initialization
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
            onClick: async (_data: ValidatedFormData) => setIsEditing(false),
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
                VisitState.DISAPPROVED,
                visitForm?.additionalInfo.finalizer.uco,
                visitForm?.additionalInfo.finalizedAt,
                visitForm?.probandLanguageCode,
                operator?.uco,
                new Date()
              );
              // TODO: mark visitForm as DELETED / DISAPPROVED?
              navigate(RoutingPaths.APPROVAL_ROOM);
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
              const visitId = await createVisitFromApproval(
                data,
                VisitState.APPROVED,
                visitForm?.additionalInfo.finalizer.uco,
                visitForm?.additionalInfo.finalizedAt,
                visitForm?.probandLanguageCode,
                operator.uco,
                new Date()
              );
              await markVisitFormAsSentToMafilDb(id);
              const pdf = await generateProbandPdf(
                visitId,
                data,
                visitForm?.additionalInfo.finalizer.uco,
                visitForm?.probandLanguageCode,
                operator.uco
              );
              await addPdfToVisit(visitId, pdf);
              await markVisitFormAsPdfGenerated(id);
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${visitId}`);
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
    <FormContainer
      isLoading={isLoading || !areDefaultValuesLoaded}
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
        disableComment={operator?.role !== "MR_HIGH_PERM" || isDisapproved}
      />
      <FormQuestions
        titleLocalizationKey="titlePart2"
        qacs={qacs.filter((qac) => qac.partNumber === QuestionPartNumber.TWO)}
        disableInputs={!isEditing}
        disableComment={operator?.role !== "MR_HIGH_PERM" || isDisapproved}
      />
      {isDisapproved && <FormDisapprovalReason />}
    </FormContainer>
  );
};
