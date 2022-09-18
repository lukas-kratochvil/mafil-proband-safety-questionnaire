import { Button } from "@mui/material";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { dummyVisits, duplicateVisit, IVisit, VisitState } from "../data/visit_data";
import { fetchRecentVisits } from "../util/utils";
import { getDummyVisit } from "../util/utils.dev";

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
    accessorKey: "projectInfo.projectName",
    header: "Projekt",
  },
  {
    accessorKey: "projectInfo.magnetDeviceName",
    header: "Přístroj",
  },
  {
    accessorFn: () => new Date().toDateString(),
    id: "processedDate",
    header: "Zpracováno",
  },
  {
    accessorFn: () => "MUNI_operator",
    id: "processUser",
    header: "Zpracoval",
  },
  {
    accessorFn: (visit) => {
      if (visit.state === VisitState.SIGNED) {
        return "Ano";
      }
      if (visit.state === VisitState.CHECKED) {
        return "Ne";
      }
      return "";
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
        variant="contained"
        onClick={() => navigate(`/auth/visit-detail/${visitId}`)}
      >
        Zobrazit detail
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          // TODO: create new form with the same data as the original form
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
