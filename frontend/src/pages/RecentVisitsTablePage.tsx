import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RecentVisitsTableActionButtons } from "@app/components/table/actions/RecentVisitsTableActionButtons";
import { defaultTableProps } from "@app/components/table/default-table-props";
import { defaultNS } from "@app/i18n";
import { IRecentVisitsTableVisit } from "@app/model/visit";
import { fetchRecentVisits } from "@app/util/mafildb_API/fetch";
import { PageContainer } from "./PageContainer";

const processedDateFormat = "d.M.y H:mm";

const RecentVisitsTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage" });
  const {
    data: visits,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["recentVisitsTablePage"], queryFn: fetchRecentVisits });

  const columns = useMemo<MRTColumnDef<IRecentVisitsTableVisit>[]>(
    () => [
      {
        accessorKey: "visitId",
        header: "Visit ID",
        size: 100,
      },
      {
        accessorFn: (visit) => `${visit.surname}, ${visit.name}`,
        id: "proband",
        header: t("header.proband"),
        minSize: 150,
      },
      {
        accessorKey: "project.acronym",
        header: t("header.project"),
        minSize: 300,
      },
      {
        accessorKey: "device.name",
        header: t("header.device"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => format(visit.date, processedDateFormat),
        id: "processedDate",
        header: t("header.processedDate"),
        sortingFn: (rowA, rowB, columnId) =>
          compareAsc(
            parse(`${rowA.getValue(columnId)}`, processedDateFormat, new Date()),
            parse(`${rowB.getValue(columnId)}`, processedDateFormat, new Date())
          ),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => `${visit.finalizer.surname}, ${visit.finalizer.name}`,
        id: "processUser",
        header: t("header.operatorProcessed"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => (visit.isPhantom ? "Dokončeno" : visit.state),
        id: "state",
        header: t("header.state"),
        maxSize: 0,
      },
      {
        id: "actionButtons",
        header: t("header.actions"),
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<IRecentVisitsTableVisit> }) => (
          <RecentVisitsTableActionButtons visit={row.original} />
        ),
        minSize: 300,
      },
    ],
    [t]
  );

  return (
    <PageContainer isTablePage>
      <MaterialReactTable {...defaultTableProps(t("title"), columns, visits, isFetching, isLoading, isError)} />
    </PageContainer>
  );
};

export default RecentVisitsTablePage;
