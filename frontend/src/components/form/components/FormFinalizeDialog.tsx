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
import { SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { FormPropType, ValidatedFormData } from "@app/model/form";
import { handleErrorsWithToast } from "@app/util/utils";
import { getValidatedFormData } from "../util/utils";

interface IFormFinalizeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onContinue: (data: ValidatedFormData) => Promise<void>;
}

// Warning dialog that the visit form has to be approved by an operator with higher permissions
export const FormFinalizeDialog = ({ isOpen, setIsOpen, onContinue }: IFormFinalizeDialogProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.finalizeDialog" });
  const { handleSubmit } = useFormContext<FormPropType>();

  const onValid = async (data: FormPropType) => {
    const validatedFormData = getValidatedFormData(data);

    try {
      await onContinue(validatedFormData);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }
  };

  return (
    <Dialog
      open={isOpen}
      fullScreen={matchesDownSmBreakpoint}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("text")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSubmit(onValid)()}>{t("buttons.continue")}</Button>
        <Button onClick={() => setIsOpen(false)}>{t("buttons.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};
