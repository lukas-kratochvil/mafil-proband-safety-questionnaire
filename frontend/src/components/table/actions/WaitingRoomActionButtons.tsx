import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "@App";
import { defaultNS } from "@i18n";
import { ActionButtonsContainer, IActionButtonsProps } from "./ActionButtonsContainer";

export const WaitingRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage.actions" });
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = () => {
    // TODO
    alert("Funkcionalita bude brzy naimplementována.");
    setOpenDeleteDialog(false);
  };

  const onCancel = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <ActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${UrlBasePaths.WAITING_ROOM}/form/${visitId}`)}
      >
        {t("processButton")}
      </Button>
      <IconButton
        onClick={() => setOpenDeleteDialog(true)}
        color="error"
        size="large"
        sx={{
          padding: "0.21rem",
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={openDeleteDialog}>
        <DialogTitle>{t("clearIconDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("clearIconDialogContent")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDelete}>{t("clearIconDialogDelete")}</Button>
          <Button onClick={onCancel}>{t("clearIconDialogCancel")}</Button>
        </DialogActions>
      </Dialog>
    </ActionButtonsContainer>
  );
};
