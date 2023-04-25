import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { RoutingPaths } from "@app/routing-paths";
import { deleteVisitForm } from "@app/util/server_API/calls";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IWaitingRoomTableActionButtonsProps {
  visitFormId: string;
  queryKey: QueryKey;
}

export const WaitingRoomTableActionButtons = ({ visitFormId, queryKey }: IWaitingRoomTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage.actions" });
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = async () => {
    await deleteVisitForm(visitFormId);
    queryClient.invalidateQueries({ queryKey, exact: true });
    setOpenDeleteDialog(false);
  };

  const onCancel = () => setOpenDeleteDialog(false);

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPaths.WAITING_ROOM}/form/${visitFormId}`)}
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
      <Dialog
        open={openDeleteDialog}
        fullScreen={matchesDownSmBreakpoint}
      >
        <DialogTitle>{t("clearIconDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("clearIconDialogContent")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDelete}>{t("clearIconDialogDelete")}</Button>
          <Button onClick={onCancel}>{t("clearIconDialogCancel")}</Button>
        </DialogActions>
      </Dialog>
    </TableActionButtonsContainer>
  );
};
