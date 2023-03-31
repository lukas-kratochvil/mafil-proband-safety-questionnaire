import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ApprovalRoomTableActionButtons } from "@app/components/table/actions/ApprovalRoomTableActionButtons";
import { defaultTableProps } from "@app/components/table/table-default-props";
import { defaultNS } from "@app/i18n";
import { IApprovalRoomVisitFormDTO } from "@app/util/server_API/dto";
import { fetchApprovalRoomVisitForms } from "@app/util/server_API/fetch";
import { getTranslation } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

const createdAtFormat = "d.M.y H:mm";
const probandBirthdateFormat = "d.M.y";

const ApprovalRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage" });
  const {
    data: visitForms,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["approvalRoomVisitForms"], queryFn: () => fetchApprovalRoomVisitForms() });

  const columns = useMemo<MRTColumnDef<IApprovalRoomVisitFormDTO>[]>(
    () => [
      {
        accessorFn: (visit) => (visit.createdAt ? format(visit.createdAt, createdAtFormat) : ""),
        id: "createdAt",
        header: t("header.registrationDate"),
        sortingFn: (rowA, rowB, columnId) =>
          compareAsc(
            parse(`${rowA.getValue(columnId)}`, createdAtFormat, new Date()),
            parse(`${rowB.getValue(columnId)}`, createdAtFormat, new Date())
          ),
        maxSize: 0,
      },
      {
        accessorKey: "additionalInfo.projectAcronym",
        header: t("header.project"),
        minSize: 300,
      },
      {
        accessorFn: (visit) => `${visit.surname}, ${visit.name}`,
        id: "proband",
        header: t("header.proband"),
        minSize: 150,
      },
      {
        accessorKey: "personalId",
        header: t("header.personalId"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => format(visit.birthdate, probandBirthdateFormat),
        id: "birthdate",
        header: t("header.birthdate"),
        sortingFn: (rowA, rowB, columnId) =>
          compareAsc(
            parse(`${rowA.getValue(columnId)}`, probandBirthdateFormat, new Date()),
            parse(`${rowB.getValue(columnId)}`, probandBirthdateFormat, new Date())
          ),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => getTranslation(visit.gender.translations, "cs"),
        id: "gender",
        header: t("header.gender"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => getTranslation(visit.nativeLanguage.translations, "cs"),
        id: "nativeLanguage",
        header: t("header.nativeLanguage"),
        maxSize: 0,
      },
      {
        id: "actionButtons",
        header: t("header.actions"),
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<IApprovalRoomVisitFormDTO> }) => (
          <ApprovalRoomTableActionButtons visitFormId={row.original.id} />
        ),
        maxSize: 0,
      },
    ],
    [t]
  );

  return (
    <PageContainer isTablePage>
      <MaterialReactTable {...defaultTableProps(t("title"), columns, visitForms, isFetching, isLoading, isError)} />
    </PageContainer>
  );
};

export default ApprovalRoomTablePage;
