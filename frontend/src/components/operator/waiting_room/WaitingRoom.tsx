import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IAuth } from "../../../App";
import { Header } from "../../header/Header";
import { Navigation } from "../navigation/Navigation";
import { waitingRoomTableData } from "../../../data/waiting_room_data";

interface IActionButtonsProps {
  titles: string[];
}

const ActionButtons = ({ titles }: IActionButtonsProps) => {
  return (
    <TableCell>
      {titles.map((title, index) =>
        <Button
          variant="contained"
          href="/auth/form-recap"
          key={index}
        >
          {title}
        </Button>
      )}
    </TableCell>
  );
}

interface IWaitingRoomProps {
  auth: IAuth;
}

export const WaitingRoom = ({ auth }: IWaitingRoomProps) => {
  return (
    <>
      <Header auth={auth} />
      <Navigation />
      <Stack
        spacing={3}
        sx={{
          marginTop: 6,
          marginBottom: 5,
          marginX: '10%',
        }}
      >
        <TableContainer component={Paper}>
          <Table
            aria-label="waiting-room table"
            sx={{
              minWidth: 650
            }}
          >
            <TableHead>
              <TableRow>
                {waitingRoomTableData.header.map((title, index) =>
                  <TableCell
                    key={index}
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {title}
                  </TableCell>
                )}
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
              {waitingRoomTableData.data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  {row.map((cell, index) =>
                    <TableCell key={index}>
                      {cell}
                    </TableCell>
                  )}
                  <ActionButtons titles={waitingRoomTableData.actionButtonTitles} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
