import { Button } from "@mui/material";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { dummyVisits, duplicateVisit, IVisit, VisitState } from "../data/visit_data";
import { fetchRecentVisits } from "../util/fetch";
import { getDummyVisit } from "../util/fetch.dev";

const processedDateFormat = "d.M.yyyy H:mm";

const header: MRTColumnDef<IVisit>[] = [
  {
    accessorKey: "visitId",
    header: "Visit ID",
    size: 100,
  },
  {
    accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
    id: "proband",
    header: "Proband",
  },
  {
    accessorKey: "projectInfo.project",
    header: "Projekt",
  },
  {
    accessorKey: "projectInfo.device",
    header: "Přístroj",
  },
  {
    // TODO: change 'visit.createdAt' for some other attribute - firstly, we need to solve which attribute should be created for this purpose
    accessorFn: (visit) => format(visit.createdAt, processedDateFormat),
    id: "processedDate",
    header: "Zpracováno",
    sortingFn: (rowA, rowB, columnId) =>
      compareAsc(
        parse(`${rowA.getValue(columnId)}`, processedDateFormat, new Date()),
        parse(`${rowB.getValue(columnId)}`, processedDateFormat, new Date())
      ),
  },
  {
    accessorFn: () => "MUNI_operator",
    id: "processUser",
    header: "Zpracoval",
  },
  {
    accessorFn: (visit) => {
      if (visit.projectInfo.isFantom) {
        return "Nepodepisuje se";
      }
      return visit.state === VisitState.SIGNED ? "Ano" : "Ne";
    },
    id: "signedUser",
    header: "Podepsáno",
  },
];

const RecentVisitsActionButtons = ({ visitId }: IActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`/auth/visit-detail/${visitId}`)}
      >
        Zobrazit detail
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          // TODO: create new form in DB with the same data as the original form
          const initialVisit = getDummyVisit(visitId);

          if (initialVisit === undefined) {
            navigate(`/auth/form/${1}`);
          } else {
            const newVisit = duplicateVisit(initialVisit);
            dummyVisits.push(newVisit);
            navigate(`/auth/form/${newVisit.id}`);
          }
        }}
      >
        Duplikovat
      </Button>
    </>
  );
};

export const RecentVisitsTablePage = () => (
  <VisitsTable
    header={header}
    fetchVisits={fetchRecentVisits}
    ActionButtons={RecentVisitsActionButtons}
    actionButtonsSize={320}
  />
);
