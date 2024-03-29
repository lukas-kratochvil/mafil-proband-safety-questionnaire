import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesVisitDuplication } from "@app/components/form/util/loaders";
import { useAuth } from "@app/hooks/auth/AuthProvider";
import { FormPropType, FormQac, ValidatedFormData } from "@app/model/form";
import { RoutingPath } from "@app/routing-paths";
import {
  addPdfToVisit,
  createFinalizedVisit,
  createPhantomVisit,
  fetchDuplicatedVisit,
} from "@app/util/mafildb_API/calls";
import { VisitState } from "@app/util/mafildb_API/dto";
import {
  createDuplicatedVisitFormForApproval,
  generatePhantomPdf,
  generateProbandPdf,
} from "@app/util/server_API/calls";
import { QuestionPartNumber } from "@app/util/server_API/dto";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormFinalizeDialog } from "../components/FormFinalizeDialog";
import { isVisitFormForApproval } from "../util/utils";
import { FormContainer } from "./FormContainer";

export const DuplicationForm = () => {
  const { id } = useParams();
  const {
    data: visit,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["visit", id],
    queryFn: () => fetchDuplicatedVisit(id),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [areDefaultValuesLoaded, setAreDefaultValuesLoaded] = useState<boolean>(false);
  const [isPhantom, setIsPhantom] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  // Setting default values
  useEffect(() => {
    if (visit !== undefined) {
      setQacs(
        visit.answersIncludingQuestions.map((answer, index) => ({
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
      const defaultValues = loadFormDefaultValuesVisitDuplication(visit);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });
      setIsPhantom(visit.isPhantom);
      setAreDefaultValuesLoaded(true);
    }
  }, [visit, setValue]);

  // Setting form buttons
  useEffect(() => {
    if (isPhantom) {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.finalize",
          onClick: async (data) => {
            const visitId = await createPhantomVisit(data, operator?.username, new Date());
            const pdf = await generatePhantomPdf(visitId, data, operator?.username);
            await addPdfToVisit(visitId, pdf);
            navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visitId}`);
          },
        },
        buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
      });
    } else if (isEditing) {
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
            await createFinalizedVisit(
              data,
              VisitState.DISAPPROVED,
              operator?.username,
              new Date(),
              visit?.probandLanguageCode
            );
            navigate(RoutingPath.RECENT_VISITS);
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
              const visitId = await createFinalizedVisit(
                data,
                VisitState.APPROVED,
                operator?.username,
                new Date(),
                visit?.probandLanguageCode
              );
              const pdf = await generateProbandPdf(visitId, data, operator?.username, visit?.probandLanguageCode);
              await addPdfToVisit(visitId, pdf);
              navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visitId}`);
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
  }, [
    getValues,
    isDisapproved,
    isEditing,
    isPhantom,
    navigate,
    operator,
    setValue,
    trigger,
    valuesBeforeEditing,
    visit?.probandLanguageCode,
  ]);

  const createVisitFormInApprovalRoom = async (data: ValidatedFormData) => {
    await createDuplicatedVisitFormForApproval(data, operator?.id);
    setOpenFinalizeDialog(false);
    navigate(RoutingPath.RECENT_VISITS);
  };

  return (
    <FormContainer
      isLoading={isLoading || !areDefaultValuesLoaded}
      isError={isError}
      buttons={formButtons}
    >
      <FormProjectInfo isPhantom={isPhantom} />
      <FormProbandInfo
        isPhantom={isPhantom}
        disableInputs={!isEditing}
      />
      {!isPhantom && (
        <>
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
            onContinue={createVisitFormInApprovalRoom}
          />
        </>
      )}
    </FormContainer>
  );
};
