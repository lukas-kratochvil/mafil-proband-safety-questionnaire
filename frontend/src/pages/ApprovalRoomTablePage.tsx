import { useQuery } from "@tanstack/react-query";
import { compareAsc, format } from "date-fns";
import type { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TablePage } from "@app/components/table/TablePage";
import { TranslatedEntityTableCell } from "@app/components/table/TranslatedEntityTableCell";
import { ApprovalRoomTableActionButtons } from "@app/components/table/actions/ApprovalRoomTableActionButtons";
import type { ApprovalRoomTableVisitForm } from "@app/model/visitForm";
import { fetchApprovalRoomTableVisitForms } from "@app/util/server_API/calls";

const ApprovalRoomTablePage = () => {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "approvalRoomTablePage" });
  const collator = useMemo(() => new Intl.Collator(i18n.language), [i18n.language]);
  const {
    data: visitForms,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["approvalRoomVisitForms"], queryFn: fetchApprovalRoomTableVisitForms });

  const columns = useMemo<MRTColumnDef<ApprovalRoomTableVisitForm>[]>(
    () => [
      {
        header: t("header.registrationDate"),
        id: "createdAt",
        accessorFn: (visit) => format(visit.createdAt, "d.M.y H:mm"),
        sortingFn: (rowA, rowB) => compareAsc(rowA.original.createdAt, rowB.original.createdAt),
        maxSize: 0,
      },
      {
        header: t("header.project"),
        accessorKey: "project.acronym",
        sortingFn: (rowA, rowB, columnId) => collator.compare(rowA.getValue(columnId), rowB.getValue(columnId)),
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
        Cell: ({ row }: { row: MRTRow<ApprovalRoomTableVisitForm> }) => (
          <TranslatedEntityTableCell translations={row.original.gender.translations} />
        ),
        maxSize: 0,
      },
      {
        header: t("header.actions"),
        id: "actionButtons",
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<ApprovalRoomTableVisitForm> }) => (
          <ApprovalRoomTableActionButtons visitFormId={row.original.id} />
        ),
        minSize: 50,
      },
    ],
    [collator, t]
  );

  return (
    <TablePage
      title={t("title")}
      columns={columns}
      data={visitForms}
      isFetching={isFetching}
      isLoading={isLoading}
      isError={isError}
      defaultSorting={[{ id: "createdAt", desc: true }]}
    />
  );
};

export default ApprovalRoomTablePage;
