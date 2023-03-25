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
import { createNewVisitFromFormData } from "@app/components/form/util/utils.dev";
import { dummyVisits } from "@app/data/visit_data";
import { useAuth } from "@app/hooks/auth/auth";
import { FormPropType, FormQac } from "@app/interfaces/form";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, VisitStateDEV } from "@app/interfaces/visit";
import { RoutingPaths } from "@app/routing-paths";
import { updateDummyVisitState } from "@app/util/fetch.dev";
import { fetchVisit } from "@app/util/mafildb_API/fetch";
import { createDuplicatedVisitFormForApproval } from "@app/util/server_API/fetch";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormFinalizeDialog } from "../components/FormFinalizeDialog";
import { FormContainer } from "./FormContainer";

export const DuplicationForm = () => {
  const { id } = useParams();
  const { data: visit, isLoading, isError } = useQuery({ queryKey: ["visitForm", id], queryFn: () => fetchVisit(id) });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { getValues, setValue, trigger } = useFormContext<FormPropType>();

  const [isPhantom, setIsPhantom] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState<FormPropType>();
  const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState<boolean>(false);
  const [qacs, setQacs] = useState<FormQac[]>([]);
  const [formButtons, setFormButtons] = useState<IFormButtonsProps>();

  useEffect(() => {
    if (visit !== undefined) {
      setQacs(visit.answers.map((answer, index) => ({ index, ...answer })));

      // TODO: try if there's a need for isLoading flag due to the slow form initialization
      const defaultValues = loadFormDefaultValuesVisitDuplication(visit);
      type DefaultValuesPropertyType = keyof typeof defaultValues;
      Object.keys(defaultValues).forEach((propertyName) => {
        setValue(propertyName as DefaultValuesPropertyType, defaultValues[propertyName as DefaultValuesPropertyType]);
      });

      setIsPhantom(visit.projectInfo.isPhantom);
    }
  }, [visit, setValue]);

  useEffect(() => {
    if (isPhantom) {
      setFormButtons({
        submitButtonProps: {
          titleLocalizationKey: "form.common.buttons.finalize",
          onClick: async (data: FormPropType) => {
            // TODO: create PHANTOM_DONE visit in the MAFILDB
            const newPhantomVisit = createNewVisitFromFormData(data, VisitStateDEV.SIGNED);
            dummyVisits.push(newPhantomVisit);
            navigate(`${RoutingPaths.RECENT_VISITS}/visit/${newPhantomVisit.id}`);
          },
        },
        buttonsProps: [getBackButtonProps(navigate, "form.common.buttons.cancel")],
      });
    } else if (isEditing) {
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
            navigate(RoutingPaths.RECENT_VISITS);
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
              const approvedVisit = createNewVisitFromFormData(data, VisitStateDEV.APPROVED);
              dummyVisits.push(approvedVisit);
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${approvedVisit.id}`);
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
  }, [
    getValues,
    id,
    isDisapproved,
    isEditing,
    isPhantom,
    navigate,
    operator?.role,
    setValue,
    trigger,
    valuesBeforeEditing,
  ]);

  const createVisitFormInApprovalRoom = async (data: FormPropType) => {
    createDuplicatedVisitFormForApproval(data, operator?.id);
    navigate(RoutingPaths.RECENT_VISITS);
  };

  return (
    <FormContainer
      isLoading={isLoading}
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
