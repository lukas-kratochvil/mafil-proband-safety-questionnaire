import ClearIcon from "@mui/icons-material/Clear";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { IProbandVisit } from "../data/visit_data";
import { fetchWaitingRoomVisits } from "../util/utils";

const header = ["Datum registrace", "Proband", "Rodné číslo", "Datum narození", "Pohlaví", "Mateřský jazyk"];

const getWaitingRoomRow = (visit: IProbandVisit): string[] => [
  new Date().toDateString(),
  visit.probandInfo.surname === "" && visit.probandInfo.name === ""
    ? ""
    : `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
  visit.probandInfo.personalId,
  visit.probandInfo.birthdate.toDateString(),
  visit.probandInfo.gender,
  visit.probandInfo.nativeLanguage,
];

const WaitingRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = () => {
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
    getVisitRow={getWaitingRoomRow}
    ActionButtons={WaitingRoomActionButtons}
  />
);
