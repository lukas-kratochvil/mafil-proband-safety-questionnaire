import ClearIcon from "@mui/icons-material/Clear";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../../App";
import { defaultNS } from "../../../i18n";
import { ActionButtonsContainer, IActionButtonsProps } from "./ActionButtonsContainer";

const deleteButtonMainColor = red[600];
const deleteButtonBgcolor = red[100];
const deleteButtonHoverMainColor = red[700];
const deleteButtonHoverBgcolor = red[200];

export const WaitingRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage.actions" });
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = () => {
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
        sx={{
          padding: "0.21rem",
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <ClearIcon
          sx={{
            height: "1.5rem",
            width: "1.5rem",
            color: deleteButtonMainColor,
            bgcolor: deleteButtonBgcolor,
            border: 1,
            borderColor: deleteButtonMainColor,
            borderRadius: "50%",
            "&:hover": {
              color: deleteButtonHoverMainColor,
              bgcolor: deleteButtonHoverBgcolor,
            },
          }}
        />
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
