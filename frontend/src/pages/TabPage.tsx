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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IAuth } from "../App";
import { ITabPageTableProps, TabType } from "../data/tab_page_table_data";
import { Header } from "../components/header/Header";
import { Navigation } from "../components/navigation/Navigation";

interface IActionButtonsProps {
  tabType: TabType;
}

const ActionButtons = ({ tabType }: IActionButtonsProps) => {
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
            // TODO: use href=`/auth/form-recap/${id}`
            href="/auth/form-recap"
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
    default:
      return <div>Error… tab page not defined!</div>;
  }
};

interface ITabPageProps {
  auth: IAuth;
  data: ITabPageTableProps;
}

export const TabPage = ({ auth, data }: ITabPageProps) => (
  <>
    <Header auth={auth} />
    <Navigation />
    <Stack
      spacing={3}
      sx={{
        marginTop: 6,
        marginBottom: 5,
        marginX: "10%",
      }}
    >
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
    </Stack>
  </>
);
