import ClearIcon from "@mui/icons-material/Clear";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProbandVisit, VisitState } from "../data/visit_data";
import { fetchRecentVisits, fetchWaitingRoomVisits } from "../util/utils";
import { PageTemplate } from "./PageTemplate";

export enum TableType {
  WAITING_ROOM,
  RECENT_VISITS,
}

interface IActionButtonsProps {
  visitId: string;
  tableType: TableType;
}

const ActionButtons = ({ visitId, tableType }: IActionButtonsProps) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = () => {
    setOpenDeleteDialog(false);
  };

  const onCancel = () => {
    setOpenDeleteDialog(false);
  };

  switch (tableType) {
    case TableType.WAITING_ROOM:
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
    case TableType.RECENT_VISITS:
      return (
        <>
          <Button
            variant="contained"
            onClick={() => navigate(`/auth/visit-detail/${visitId}`)}
          >
            Zobrazit detail
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: create new form with the same data as the original form
              const newVisitId = 1;
              navigate(`/auth/form/${newVisitId}`);
            }}
          >
            Duplikovat
          </Button>
        </>
      );
    default:
      return <div>Error… tab page not defined!</div>;
  }
};

const getWaitingRoomRow = (visit: IProbandVisit): string[] => [
  new Date().toDateString(),
  `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
  visit.probandInfo.personalId,
  visit.probandInfo.birthdate.toDateString(),
  visit.probandInfo.gender,
  visit.probandInfo.nativeLanguage,
];

const getRecentVisitsRow = (visit: IProbandVisit): string[] => {
  let isSignedText = "";

  if (visit.state === VisitState.SIGNED) {
    isSignedText = "Ano";
  } else if (visit.state === VisitState.CHECKED) {
    isSignedText = "Ne";
  }

  return [
    visit.visitId,
    `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
    visit.projectInfo.projectId,
    visit.projectInfo.magnetDeviceId,
    new Date().toDateString(),
    "MUNI_operator",
    isSignedText,
  ];
};

interface ITablePageProps {
  type: TableType;
}

export const TablePage = ({ type }: ITablePageProps) => {
  let header: string[] = [];
  let getVisitRow: (visit: IProbandVisit) => string[] = (_) => [];

  const [visits, setVisits] = useState<IProbandVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  switch (type) {
    case TableType.WAITING_ROOM:
      header = ["Datum registrace", "Proband", "Rodné číslo", "Datum narození", "Pohlaví", "Mateřský jazyk"];
      getVisitRow = getWaitingRoomRow;
      break;
    case TableType.RECENT_VISITS:
      header = ["Visit ID", "Proband", "Projekt", "Přístroj", "Zpracováno", "Zpracoval", "Podepsáno"];
      getVisitRow = getRecentVisitsRow;
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        let visitResponse;

        switch (type) {
          case TableType.WAITING_ROOM:
            visitResponse = fetchWaitingRoomVisits();
            break;
          case TableType.RECENT_VISITS:
            visitResponse = fetchRecentVisits();
            break;
          default:
            break;
        }

        if (visitResponse !== undefined) {
          setVisits(await visitResponse);
        }

        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchVisits();
  }, [type]);

  return (
    <PageTemplate isTabPage>
      <TableContainer component={Paper}>
        <Table
          aria-label="waiting-room table"
          sx={{
            minWidth: "40rem",
          }}
        >
          <TableHead>
            <TableRow>
              {header.map((title, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  {title}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Akce
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow
                key={visit.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                {getVisitRow(visit).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
                <TableCell sx={{ maxWidth: "fit-content" }}>
                  <Grid
                    container
                    direction="row"
                    gap="0.5rem"
                  >
                    <ActionButtons
                      visitId={visit.id}
                      tableType={type}
                    />
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageTemplate>
  );
};
