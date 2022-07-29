import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IAuth } from "../App";
import { ITabPageTableProps } from "../data/waiting_room_data";
import { Header } from "../components/header/Header";
import { Navigation } from "../components/navigation/Navigation";

interface IActionButtonsProps {
  id: string;
  titles: string[];
}

const ActionButtons = ({ id, titles }: IActionButtonsProps) => {
  return (
    <TableCell>
      {titles.map((title, index) =>
        <Button
          variant="contained"
          // TODO: use href=`/auth/form-recap/${id}`
          href="/auth/form-recap"
          key={index}
        >
          {title}
        </Button>
      )}
    </TableCell>
  );
}

interface ITabPageProps {
  auth: IAuth;
  data: ITabPageTableProps;
}

export const TabPage = ({ auth, data }: ITabPageProps) => {
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
                {data.header.map((title, index) =>
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
              {data.data.map((row, index) => (
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
                  {/* TODO: pass the actual form id */}
                  <ActionButtons id={index.toString()} titles={data.actionButtonTitles} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
