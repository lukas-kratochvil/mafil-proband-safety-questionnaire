import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TranslatedTableCell } from "@app/components/table/TranslatedTableCell";
import { RecentVisitsTableActionButtons } from "@app/components/table/actions/RecentVisitsTableActionButtons";
import { defaultTableProps } from "@app/components/table/default-table-props";
import { defaultNS } from "@app/i18n";
import { IRecentVisitsTableVisit } from "@app/model/visit";
import { fetchRecentVisits } from "@app/util/mafildb_API/calls";
import { ApprovalState, SignatureState } from "@app/util/mafildb_API/dto";
import { PageContainer } from "./PageContainer";

const processedDateFormat = "d.M.y H:mm";

const getStateLocalizationString = (visit: IRecentVisitsTableVisit): string | undefined => {
  if (visit.isPhantom) {
    return "phantomDone";
  }

  switch (visit.approvalState) {
    case ApprovalState.DISAPPROVED:
      return "disapproved";
    case ApprovalState.APPROVED:
      switch (visit.signatureState) {
        case SignatureState.NOT_SET:
          return "approved";
        case SignatureState.FOR_SIGNATURE_PHYSICALLY:
          return "forSignaturePhysically";
        case SignatureState.FOR_SIGNATURE_ELECTRONICALLY:
          return "forSignatureElectronically";
        case SignatureState.SIGNED_PHYSICALLY:
          return "signedPhysically";
        case SignatureState.SIGNED_ELECTRONICALLY:
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

  const columns = useMemo<MRTColumnDef<IRecentVisitsTableVisit>[]>(
    () => [
      {
        accessorKey: "visitId",
        header: "Visit ID",
        size: 100,
      },
      {
        accessorFn: (visit) => `${visit.subject.surname}, ${visit.subject.name}`,
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
        accessorFn: (visit) => format(visit.measurementDate, processedDateFormat),
        id: "processedDate",
        header: t("header.processedDate"),
        sortingFn: (rowA, rowB) =>
          // Sorting is done by 'created' attribute, because the 'date' attribute does not contain the time
          compareAsc(
            parse(`${rowA.original.created}`, processedDateFormat, new Date()),
            parse(`${rowB.original.created}`, processedDateFormat, new Date())
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
        id: "state",
        header: t("header.state"),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<IRecentVisitsTableVisit> }) => {
          const stateLocalizationString = getStateLocalizationString(row.original);
          return stateLocalizationString === undefined ? null : (
            <TranslatedTableCell localizationKey={`recentVisitsTablePage.visitState.${stateLocalizationString}`} />
          );
        },
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
