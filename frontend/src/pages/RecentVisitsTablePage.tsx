import { useQuery } from "@tanstack/react-query";
import { compareAsc, format } from "date-fns";
import MaterialReactTable, { type MRT_ColumnDef as MRTColumnDef, type MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TranslatedTableCell } from "@app/components/table/TranslatedTableCell";
import { RecentVisitsTableActionButtons } from "@app/components/table/actions/RecentVisitsTableActionButtons";
import { defaultTableProps, type DefaultSorting } from "@app/components/table/default-table-props";
import { defaultNS } from "@app/i18n/i18n";
import type { RecentVisitsTableVisit } from "@app/model/visit";
import { fetchRecentVisits } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState, MDB_SignatureState } from "@app/util/mafildb_API/dto";
import { PageContainer } from "./PageContainer";

const getStateLocalizationString = (visit: RecentVisitsTableVisit): string | undefined => {
  if (visit.isPhantom) {
    return "phantomDone";
  }

  switch (visit.approvalState) {
    case MDB_ApprovalState.DISAPPROVED:
      return "disapproved";
    case MDB_ApprovalState.APPROVED:
      switch (visit.signatureState) {
        case MDB_SignatureState.NOT_SET:
          return "approved";
        case MDB_SignatureState.FOR_SIGNATURE_PHYSICALLY:
          return "forSignaturePhysically";
        case MDB_SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return "forSignatureElectronically";
        case MDB_SignatureState.SIGNED_PHYSICALLY:
          return "signedPhysically";
        case MDB_SignatureState.SIGNED_ELECTRONICALLY:
          return "signedElectronically";
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

const RecentVisitsTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage" });
  const {
    data: visits,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["recentVisitsTablePage"], queryFn: fetchRecentVisits });

  const columns = useMemo<MRTColumnDef<RecentVisitsTableVisit>[]>(
    () => [
      {
        header: "Visit ID",
        accessorKey: "visitId",
        size: 100,
      },
      {
        header: t("header.proband"),
        id: "proband",
        accessorFn: (visit) => `${visit.subject.surname}, ${visit.subject.name}`,
        minSize: 150,
      },
      {
        header: t("header.project"),
        accessorKey: "project.acronym",
        minSize: 300,
      },
      {
        header: t("header.device"),
        id: "device",
        accessorFn: (visit) => visit.device?.name ?? "",
        maxSize: 0,
      },
      {
        header: t("header.processedDate"),
        id: "processedDate",
        accessorFn: (visit) => format(visit.measurementDate, "d.M.y"),
        // Sorting is done by 'created' attribute, because the 'measurementDate' does not contain the time
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.created, rowB.original.created),
        maxSize: 0,
      },
      {
        header: t("header.operatorProcessed"),
        id: "processUser",
        accessorFn: (visit) => (visit.finalizer ? `${visit.finalizer.surname}, ${visit.finalizer.name}` : ""),
        maxSize: 0,
      },
      {
        header: t("header.state"),
        id: "state",
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<RecentVisitsTableVisit> }) => {
          const stateLocalizationString = getStateLocalizationString(row.original);
          return stateLocalizationString === undefined ? null : (
            <TranslatedTableCell localizationKey={`recentVisitsTablePage.visitState.${stateLocalizationString}`} />
          );
        },
        maxSize: 0,
      },
      {
        header: t("header.actions"),
        id: "actionButtons",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<RecentVisitsTableVisit> }) => (
          <RecentVisitsTableActionButtons visit={row.original} />
        ),
        minSize: 300,
      },
    ],
    [t]
  );

  const defaultSorting: DefaultSorting = [{ id: "processedDate", desc: true }];

  return (
    <PageContainer isTablePage>
      <MaterialReactTable
        {...defaultTableProps(t("title"), columns, visits, isFetching, isLoading, isError, defaultSorting)}
      />
    </PageContainer>
  );
};

export default RecentVisitsTablePage;
