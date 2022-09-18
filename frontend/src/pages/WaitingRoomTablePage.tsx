import ClearIcon from "@mui/icons-material/Clear";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { IVisit } from "../data/visit_data";
import { fetchWaitingRoomVisits } from "../util/utils";

const header: MRTColumnDef<IVisit>[] = [
  {
    accessorFn: () => new Date().toDateString(),
    id: "registrationDate",
    header: "Datum registrace",
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
    accessorFn: (visit) => `${visit.probandInfo.birthdate.toDateString()}`,
    id: "probandInfo.birthdate",
    header: "Datum narození",
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
            color: "red",
            background: "pink",
            border: 1,
            borderColor: "black",
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
