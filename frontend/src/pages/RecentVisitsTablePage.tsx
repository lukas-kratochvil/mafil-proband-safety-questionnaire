import { useQuery } from "@tanstack/react-query";
import { compareAsc, format } from "date-fns";
import type { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TablePage } from "@app/components/table/TablePage";
import { TranslatedTableCell } from "@app/components/table/TranslatedTableCell";
import { RecentVisitsTableActionButtons } from "@app/components/table/actions/RecentVisitsTableActionButtons";
import type { RecentVisitsTableVisit } from "@app/model/visit";
import { fetchRecentVisits } from "@app/util/mafildb_API/calls";
import { MDB_ApprovalState, MDB_SignatureState } from "@app/util/mafildb_API/dto";

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
  const { i18n, t } = useTranslation("translation", { keyPrefix: "recentVisitsTablePage" });
  const collator = useMemo(() => new Intl.Collator(i18n.language), [i18n.language]);
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
        size: 40,
      },
      {
        header: t("header.proband"),
        id: "proband",
        accessorFn: (visit) => `${visit.subject.surname}, ${visit.subject.name}`,
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
        size: 150,
      },
      {
        header: t("header.project"),
        accessorKey: "project.acronym",
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
      },
      {
        header: t("header.device"),
        id: "device",
        accessorFn: (visit) => visit.device?.name ?? "",
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
        size: 0,
      },
      {
        header: t("header.created"),
        id: "created",
        accessorFn: (visit) => format(visit.created, "d.M.y H:mm"),
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.created, rowB.original.created),
        size: 50,
      },
      {
        header: t("header.visitDate"),
        id: "visitDate",
        accessorFn: (visit) => format(visit.measurementDate, "d.M.y"),
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.measurementDate, rowB.original.measurementDate),
        size: 50,
      },
      {
        header: t("header.processedBy"),
        id: "processUser",
        accessorFn: (visit) => (visit.finalizer ? `${visit.finalizer.surname}, ${visit.finalizer.name}` : ""),
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
        size: 150,
      },
      {
        header: t("header.state"),
        id: "state",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<RecentVisitsTableVisit> }) => {
          const stateLocalizationString = getStateLocalizationString(row.original);
          return stateLocalizationString === undefined ? null : (
            <TranslatedTableCell localizationKey={`recentVisitsTablePage.visitState.${stateLocalizationString}`} />
          );
        },
        size: 50,
      },
      {
        header: t("header.actions"),
        id: "actionButtons",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<RecentVisitsTableVisit> }) => (
          <RecentVisitsTableActionButtons visit={row.original} />
        ),
        minSize: 280,
      },
    ],
    [collator, t]
  );

  return (
    <TablePage
      title={t("title")}
      columns={columns}
      data={visits}
      isFetching={isFetching}
      isLoading={isLoading}
      isError={isError}
      defaultSorting={[{ id: "created", desc: true }]}
    />
  );
};

export default RecentVisitsTablePage;
