import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { IFormButtonsProps } from "@app/components/form/components/FormButtons";
import { FormProbandContact } from "@app/components/form/components/FormProbandContact";
import { FormProbandInfo } from "@app/components/form/components/FormProbandInfo";
import { FormProjectInfo } from "@app/components/form/components/FormProjectInfo";
import { FormQuestions } from "@app/components/form/components/FormQuestions";
import { loadFormDefaultValuesFromVisit } from "@app/components/form/util/loaders";
import { useAuth } from "@app/hooks/auth/auth";
import { defaultNS } from "@app/i18n";
import { FormPropType, FormQac } from "@app/interfaces/form";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, VisitState } from "@app/interfaces/visit";
import { RoutingPaths } from "@app/routing-paths";
import { fetchVisit } from "@app/util/fetch";
import { updateDummyVisitState } from "@app/util/fetch.dev";
import { getBackButtonProps } from "@app/util/utils";
import { FormDisapprovalReason } from "../components/FormDisapprovalReason";
import { FormContainer } from "./FormContainer";

export const WaitingRoomForm = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomFormPage.finalizeDialog" });
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const { id } = useParams();
  const {
    data: visit,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["visitForm"],
    queryFn: () => fetchVisit(id),
  });
  const navigate = useNavigate();
  const { operator } = useAuth();
  const { getValues, handleSubmit, setValue, trigger } = useFormContext<FormPropType>();

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
      const defaultValues = loadFormDefaultValuesFromVisit(visit);
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
          onClick: (_data: FormPropType) => setIsEditing(false),
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
          onClick: (data: FormPropType) => {
            // TODO: store changes in DB
            updateDummyVisitState(id, VisitState.DISAPPROVED);
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
          onClick: (data: FormPropType) => {
            if (
              operator?.hasHigherPermission
              || data.answers.find(
                (answer) => answer.partNumber === QuestionPartNumber.TWO && answer.answer === AnswerOption.YES
              ) === undefined
            ) {
              // TODO: store changes in DB
              updateDummyVisitState(id, VisitState.APPROVED);
              navigate(`${RoutingPaths.RECENT_VISITS}/visit/${id}`);
            } else {
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
    navigate,
    operator?.hasHigherPermission,
    setValue,
    trigger,
    valuesBeforeEditing,
  ]);

  const onSubmit = (data: FormPropType) => {
    // TODO: store changes in DB
    updateDummyVisitState(id, VisitState.IN_APPROVAL);
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
      <Dialog
        open={openFinalizeDialog}
        fullScreen={matchesDownSmBreakpoint}
      >
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogContent>
          <Typography>{t("text")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSubmit(onSubmit)()}>{t("buttons.continue")}</Button>
          <Button onClick={() => setOpenFinalizeDialog(false)}>{t("buttons.cancel")}</Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
};
