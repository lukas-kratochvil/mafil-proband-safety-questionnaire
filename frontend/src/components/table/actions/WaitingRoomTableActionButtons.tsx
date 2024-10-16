import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  type Theme,
} from "@mui/material";
import type { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { WaitingRoomTableVisitForm } from "@app/model/visitForm";
import { RoutingPath } from "@app/routing-paths";
import { deleteVisitForm } from "@app/util/server_API/calls";
import { handleErrorsWithToast } from "@app/util/utils";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

type WaitingRoomTableActionButtonsProps = {
  visitFormId: string;
  refetchWaitingRoomTable: ReturnType<typeof useQuery<WaitingRoomTableVisitForm[]>>["refetch"];
};

export const WaitingRoomTableActionButtons = ({
  visitFormId,
  refetchWaitingRoomTable,
}: WaitingRoomTableActionButtonsProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "waitingRoomTablePage.actions" });
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = async () => {
    try {
      await deleteVisitForm(visitFormId);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }

    await refetchWaitingRoomTable();
    setOpenDeleteDialog(false);
  };

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        component={Link}
        to={`${RoutingPath.WAITING_ROOM_FORM}/${visitFormId}`}
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
          <Button onClick={() => setOpenDeleteDialog(false)}>{t("clearIconDialogCancel")}</Button>
        </DialogActions>
      </Dialog>
    </TableActionButtonsContainer>
  );
};
