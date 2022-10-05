import { Button } from "@mui/material";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { IVisit } from "../data/visit_data";
import { fetchApprovalVisits } from "../util/fetch";

const createdAtFormat = "d.M.yyyy H:mm";
const probandBirthdateFormat = "d.M.yyyy";

const header: MRTColumnDef<IVisit>[] = [
  {
    accessorFn: (visit) => format(visit.createdAt, createdAtFormat),
    id: "createdAt",
    header: "Datum registrace",
    sortingFn: (rowA, rowB, columnId) =>
      compareAsc(
        parse(`${rowA.getValue(columnId)}`, createdAtFormat, new Date()),
        parse(`${rowB.getValue(columnId)}`, createdAtFormat, new Date())
      ),
  },
  {
    accessorKey: "projectInfo.project",
    header: "Projekt",
  },
  {
    accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
    id: "proband",
    header: "Proband",
  },
  {
    accessorKey: "probandInfo.personalId",
    header: "Rodné číslo",
  },
  {
    accessorFn: (visit) => format(visit.probandInfo.birthdate, probandBirthdateFormat),
    id: "probandInfo.birthdate",
    header: "Datum narození",
    sortingFn: (rowA, rowB, columnId) =>
      compareAsc(
        parse(`${rowA.getValue(columnId)}`, probandBirthdateFormat, new Date()),
        parse(`${rowB.getValue(columnId)}`, probandBirthdateFormat, new Date())
      ),
  },
  {
    accessorKey: "probandInfo.gender",
    header: "Pohlaví",
  },
  {
    accessorKey: "probandInfo.nativeLanguage",
    header: "Mateřský jazyk",
  },
];

const ApprovalActionButtons = ({ visitId }: IActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <Button
      size="small"
      variant="contained"
      onClick={() => navigate(`/auth/approval/form/${visitId}`)}
    >
      Zobrazit
    </Button>
  );
};

export const ApprovalTablePage = () => (
  <VisitsTable
    header={header}
    fetchVisits={fetchApprovalVisits}
    ActionButtons={ApprovalActionButtons}
    actionButtonsSize={100}
  />
);
