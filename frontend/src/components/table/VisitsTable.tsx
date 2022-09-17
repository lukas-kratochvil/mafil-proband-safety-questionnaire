import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { IVisit } from "../../data/visit_data";
import { PageTemplate } from "../../pages/PageTemplate";

export interface IActionButtonsProps {
  visitId: string;
}

interface IVisitsTableProps {
  header: string[];
  fetchVisits: () => Promise<IVisit[]>;
  getVisitRow: (visit: IVisit) => string[];
  ActionButtons: FunctionComponent<IActionButtonsProps>;
}

export const VisitsTable = ({ header, fetchVisits, getVisitRow, ActionButtons }: IVisitsTableProps) => {
  const [visits, setVisits] = useState<IVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // TODO: use MUI Skeleton while data is fetching
  const [isError, setIsError] = useState<boolean>(false); // TODO: create ErrorPage

  useEffect(() => {
    const fetchTableVisits = async () => {
      try {
        const response = await fetchVisits();
        setVisits(response);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchTableVisits();
  }, [fetchVisits]);

  return (
    <PageTemplate isTablePage>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "40rem" }}>
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
                    <ActionButtons visitId={visit.id} />
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
