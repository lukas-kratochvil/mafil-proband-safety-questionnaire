import ClearIcon from "@mui/icons-material/Clear";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { IVisit } from "../data/visit_data";
import { fetchWaitingRoomVisits } from "../util/utils";

const header: MRTColumnDef<IVisit>[] = [
  {
    accessorFn: (visit) => format(visit.createdAt, "d.M.yyyy H:mm"),
    id: "createdAt",
    header: "Datum registrace",
    sortingFn: (rowA, rowB, columnId) =>
      compareAsc(
        parse(`${rowA.getValue(columnId)}`, "d.M.yyyy H:mm", new Date()),
        parse(`${rowB.getValue(columnId)}`, "d.M.yyyy H:mm", new Date())
      ),
  },
  {
    accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
    id: "proband",
    header: "Proband",
  },
  {
    accessorKey: "probandInfo.personalId",
    header: "Rodné číslo",
  },
  {
    accessorFn: (visit) => format(visit.probandInfo.birthdate, "d.M.yyyy"),
    id: "probandInfo.birthdate",
    header: "Datum narození",
    sortingFn: (rowA, rowB, columnId) =>
      compareAsc(
        parse(`${rowA.getValue(columnId)}`, "d.M.yyyy", new Date()),
        parse(`${rowB.getValue(columnId)}`, "d.M.yyyy", new Date())
      ),
  },
  {
    accessorKey: "probandInfo.gender",
    header: "Pohlaví",
  },
  {
    accessorKey: "probandInfo.nativeLanguage",
    header: "Mateřský jazyk",
  },
];

const WaitingRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
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
        variant="contained"
        onClick={() => navigate(`/auth/form/${visitId}`)}
      >
        Zpracovat
      </Button>
      <IconButton onClick={() => setOpenDeleteDialog(true)}>
        <ClearIcon
          sx={{
            color: red[600],
            background: red[100],
            border: 1,
            borderColor: red[600],
            borderRadius: "50%"
          }}
        />
      </IconButton>
      <Dialog open={openDeleteDialog}>
        <DialogTitle>Odstranění záznamu z Čekárny</DialogTitle>
        <DialogContent>
          <Typography>Opravdu si přejete odstranit záznam XY z Čekárny?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDelete}>Odstranit</Button>
          <Button onClick={onCancel}>Zrušit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const WaitingRoomTablePage = () => (
  <VisitsTable
    header={header}
    fetchVisits={fetchWaitingRoomVisits}
    ActionButtons={WaitingRoomActionButtons}
    actionButtonsSize={100}
  />
);
