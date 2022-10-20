import { Button } from "@mui/material";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../App";
import { IActionButtonsProps, InteractingTable } from "../components/table/InteractingTable";
import { IVisit } from "../data/visit_data";
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
    accessorFn: (visit) => (visit.projectInfo.isPhantom ? "Dokončeno" : visit.state),
    id: "state",
    header: "Stav",
  },
];

const RecentVisitsActionButtons = ({ visitId }: IActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${UrlBasePaths.RECENT_VISITS}/visit/${visitId}`)}
      >
        Zobrazit detail
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          // TODO: create new form (not in DB!) with the same data as the original form
          const initialVisit = getDummyVisit(visitId);

          if (initialVisit === undefined) {
            // TODO: show some error instead!
            navigate(`${UrlBasePaths.RECENT_VISITS}/duplicate/${1}`);
          } else {
            navigate(`${UrlBasePaths.RECENT_VISITS}/duplicate/${initialVisit.id}`);
          }
        }}
      >
        Duplikovat
      </Button>
    </>
  );
};

export const RecentVisitsTablePage = () => (
  <InteractingTable
    header={header}
    fetchVisits={fetchRecentVisits}
    ActionButtons={RecentVisitsActionButtons}
    actionButtonsSize={320}
  />
);
