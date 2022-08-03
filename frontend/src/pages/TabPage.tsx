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
import { PageTemplate } from "./PageTemplate";

interface IActionButtonsProps {
  tabType: TabType;
}

const ActionButtons = ({ tabType }: IActionButtonsProps) => {
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
            // TODO: use `/auth/form-recap/${id}`
            onClick={() => navigate("/auth/form-recap")}
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
    // TODO: last visits table buttons
    case TabType.RECENT_VISITS:
      return (
        <>
          <Button
            variant="contained"
            // TODO: use `/auth/form-recap/${id}`
            onClick={() => navigate("/auth/form-recap")}
          >
            Stáhnout PDF
          </Button>
          <Button
            variant="contained"
            // TODO: use `/auth/form-recap/${id}`
            onClick={() => navigate("/auth/form-recap")}
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
          minWidth: 650,
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
                  gap={1}
                >
                  {/* TODO: pass the actual form id */}
                  <ActionButtons tabType={data.type} />
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </PageTemplate>
);
