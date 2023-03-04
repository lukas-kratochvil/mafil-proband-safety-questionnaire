import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useTranslation } from "react-i18next";
import { InteractingTable } from "@app/components/table/InteractingTable";
import { RecentVisitsActionButtons } from "@app/components/table/actions/RecentVisitsActionButtons";
import { defaultNS } from "@app/i18n";
import { IVisit } from "@app/interfaces/visit";
import { fetchRecentVisits } from "@app/util/fetch-mafildb";

const processedDateFormat = "d.M.y H:mm";

const RecentVisitsTablePage = () => {
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
      minSize: 150,
    },
    {
      accessorKey: "projectInfo.project",
      header: t("project"),
      minSize: 300,
    },
    {
      accessorKey: "projectInfo.device",
      header: t("device"),
      maxSize: 0,
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
      maxSize: 0,
    },
    {
      accessorFn: () => "MUNI_operator",
      id: "processUser",
      header: t("operatorProcessed"),
      maxSize: 0,
    },
    {
      accessorFn: (visit) => (visit.projectInfo.isPhantom ? "Dokončeno" : visit.state),
      id: "state",
      header: t("state"),
      maxSize: 0,
    },
    {
      id: "actionButtons",
      header: t("actions"),
      columnDefType: "display", // turns off data column features like sorting, filtering, etc.
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ row }: { row: MRTRow<IVisit> }) => <RecentVisitsActionButtons visitId={row.original.id} />,
      minSize: 300,
    },
  ];

  return (
    <InteractingTable
      titleLocalizationKey="recentVisitsTablePage.title"
      header={header}
      queryKey="recentVisits"
      fetchVisits={fetchRecentVisits}
    />
  );
};

export default RecentVisitsTablePage;
