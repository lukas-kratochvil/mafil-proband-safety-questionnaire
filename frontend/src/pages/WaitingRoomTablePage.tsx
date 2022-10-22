import ClearIcon from "@mui/icons-material/Clear";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../App";
import { IActionButtonsProps, InteractingTable } from "../components/table/InteractingTable";
import { IVisit } from "../data/visit_data";
import { defaultNS } from "../i18n";
import { fetchWaitingRoomVisits } from "../util/fetch";

const deleteButtonMainColor = red[600];
const deleteButtonBgcolor = red[100];
const deleteButtonHoverMainColor = red[700];
const deleteButtonHoverBgcolor = red[200];

const WaitingRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
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
    <>
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
    </>
  );
};

const createdAtFormat = "d.M.yyyy H:mm";
const probandBirthdateFormat = "d.M.yyyy";

export const WaitingRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage" });

  const header: MRTColumnDef<IVisit>[] = [
    {
      accessorFn: (visit) => format(visit.createdAt, createdAtFormat),
      id: "createdAt",
      header: t("header.registrationDate"),
      sortingFn: (rowA, rowB, columnId) =>
        compareAsc(
          parse(`${rowA.getValue(columnId)}`, createdAtFormat, new Date()),
          parse(`${rowB.getValue(columnId)}`, createdAtFormat, new Date())
        ),
    },
    {
      accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
      id: "proband",
      header: t("header.proband"),
    },
    {
      accessorKey: "probandInfo.personalId",
      header: t("header.personalId"),
    },
    {
      accessorFn: (visit) => format(visit.probandInfo.birthdate, probandBirthdateFormat),
      id: "probandInfo.birthdate",
      header: t("header.birthdate"),
      sortingFn: (rowA, rowB, columnId) =>
        compareAsc(
          parse(`${rowA.getValue(columnId)}`, probandBirthdateFormat, new Date()),
          parse(`${rowB.getValue(columnId)}`, probandBirthdateFormat, new Date())
        ),
    },
    {
      accessorKey: "probandInfo.gender",
      header: t("header.gender"),
    },
    {
      accessorKey: "probandInfo.nativeLanguage",
      header: t("header.nativeLanguage"),
    },
  ];

  return (
    <InteractingTable
      header={header}
      fetchVisits={fetchWaitingRoomVisits}
      ActionButtons={WaitingRoomActionButtons}
      actionButtonsSize={100}
    />
  );
};
