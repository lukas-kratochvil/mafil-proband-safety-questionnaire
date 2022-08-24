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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITabPageTableProps, TabType } from "../data/tab_page_table_data";
import { dummyVisit } from "../data/visit_data";
import { PageTemplate } from "./PageTemplate";

interface IActionButtonsProps {
  visitId: string;
  tabType: TabType;
}

const ActionButtons = ({ visitId, tabType }: IActionButtonsProps) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const onDelete = () => {
    setOpenDeleteDialog(false);
  };

  const onCancel = () => {
    setOpenDeleteDialog(false);
  };

  switch (tabType) {
    case TabType.WAITING_ROOM:
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
    case TabType.RECENT_VISITS:
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

interface ITabPageProps {
  data: ITabPageTableProps;
}

export const TabPage = ({ data }: ITabPageProps) => (
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
            {data.header.map((title, index) => (
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
          {data.data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
              <TableCell sx={{ maxWidth: "fit-content" }}>
                <Grid
                  container
                  direction="row"
                  gap="0.5rem"
                >
                  <ActionButtons
                    visitId={dummyVisit.id} // TODO: pass the actual form id
                    tabType={data.type}
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
