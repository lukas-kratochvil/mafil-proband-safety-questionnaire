import { useQuery } from "@tanstack/react-query";
import { compareAsc, format } from "date-fns";
import MaterialReactTable, { type MRT_ColumnDef as MRTColumnDef, type MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TranslatedEntityTableCell } from "@app/components/table/TranslatedEntityTableCell";
import { WaitingRoomTableActionButtons } from "@app/components/table/actions/WaitingRoomTableActionButtons";
import { defaultTableProps, type DefaultSorting } from "@app/components/table/default-table-props";
import { defaultNS } from "@app/i18n/i18n";
import type { WaitingRoomTableVisitForm } from "@app/model/visitForm";
import { fetchWaitingRoomTableVisitForms } from "@app/util/server_API/calls";
import { PageContainer } from "./PageContainer";

const queryKey = ["waitingRoomVisitForms"] as const;

const WaitingRoomTablePage = () => {
  const { i18n, t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage" });
  const collator = useMemo(() => new Intl.Collator(i18n.language), [i18n.language]);
  const {
    data: visitForms,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey, queryFn: fetchWaitingRoomTableVisitForms });

  const columns = useMemo<MRTColumnDef<WaitingRoomTableVisitForm>[]>(
    () => [
      {
        header: t("header.registrationDate"),
        id: "createdAt",
        accessorFn: (visit) => format(visit.createdAt, "d.M.y H:mm"),
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.createdAt, rowB.original.createdAt),
        maxSize: 0,
      },
      {
        header: t("header.proband"),
        id: "proband",
        accessorFn: (visit) => `${visit.surname}, ${visit.name}`,
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
        minSize: 150,
      },
      {
        header: t("header.personalId"),
        accessorKey: "personalId",
        maxSize: 0,
      },
      {
        header: t("header.birthdate"),
        id: "birthdate",
        accessorFn: (visit) => format(visit.birthdate, "d.M.y"),
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.birthdate, rowB.original.birthdate),
        maxSize: 0,
      },
      {
        header: t("header.nativeLanguage"),
        id: "nativeLanguage",
        accessorFn: (visit) => visit.nativeLanguage.nativeName,
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
        maxSize: 0,
      },
      {
        header: t("header.gender"),
        accessorKey: "gender",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<WaitingRoomTableVisitForm> }) => (
          <TranslatedEntityTableCell translations={row.original.gender.translations} />
        ),
        maxSize: 0,
      },
      {
        header: t("header.actions"),
        id: "actionButtons",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<WaitingRoomTableVisitForm> }) => (
          <WaitingRoomTableActionButtons
            visitFormId={row.original.id}
            queryKey={queryKey}
          />
        ),
        maxSize: 0,
      },
    ],
    [collator, t]
  );

  const defaultSorting: DefaultSorting = [{ id: "createdAt", desc: true }];

  return (
    <PageContainer isTablePage>
      <MaterialReactTable
        {...defaultTableProps(t("title"), columns, visitForms, isFetching, isLoading, isError, defaultSorting)}
      />
    </PageContainer>
  );
};

export default WaitingRoomTablePage;
