import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useTranslation } from "react-i18next";
import { InteractingTable } from "../components/table/InteractingTable";
import { RecentVisitsActionButtons } from "../components/table/actions/RecentVisitsActionButtons";
import { IVisit } from "../data/visit_data";
import { defaultNS } from "../i18n";
import { fetchRecentVisits } from "../util/fetch";

const processedDateFormat = "d.M.yyyy H:mm";

export const RecentVisitsTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage.header" });

  const header: MRTColumnDef<IVisit>[] = [
    {
      accessorKey: "visitId",
      header: "Visit ID",
      size: 100,
    },
    {
      accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
      id: "proband",
      header: t("proband"),
    },
    {
      accessorKey: "projectInfo.project",
      header: t("project"),
    },
    {
      accessorKey: "projectInfo.device",
      header: t("device"),
    },
    {
      // TODO: change 'visit.createdAt' for some other attribute - firstly, we need to solve which attribute should be created for this purpose
      accessorFn: (visit) => format(visit.createdAt, processedDateFormat),
      id: "processedDate",
      header: t("processedDate"),
      sortingFn: (rowA, rowB, columnId) =>
        compareAsc(
          parse(`${rowA.getValue(columnId)}`, processedDateFormat, new Date()),
          parse(`${rowB.getValue(columnId)}`, processedDateFormat, new Date())
        ),
    },
    {
      accessorFn: () => "MUNI_operator",
      id: "processUser",
      header: t("operatorProcessed"),
    },
    {
      accessorFn: (visit) => (visit.projectInfo.isPhantom ? "Dokončeno" : visit.state),
      id: "state",
      header: t("state"),
    },
    {
      id: "actionButtons",
      header: t("actions"),
      columnDefType: "display", // turns off data column features like sorting, filtering, etc.
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ row }: { row: MRTRow<IVisit> }) => <RecentVisitsActionButtons visitId={row.original.id} />,
    },
  ];

  return (
    <InteractingTable
      header={header}
      fetchVisits={fetchRecentVisits}
    />
  );
};
