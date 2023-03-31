import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WaitingRoomTableActionButtons } from "@app/components/table/actions/WaitingRoomTableActionButtons";
import { defaultTableProps } from "@app/components/table/table-default-props";
import { defaultNS } from "@app/i18n";
import { IWaitingRoomVisitFormDTO } from "@app/util/server_API/dto";
import { fetchWaitingRoomVisitForms } from "@app/util/server_API/fetch";
import { getTranslation } from "@app/util/utils";
import { PageContainer } from "./PageContainer";

const createdAtFormat = "d.M.y H:mm";
const probandBirthdateFormat = "d.M.y";

const queryKey = ["waitingRoomVisitForms"];

const WaitingRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage" });
  const {
    data: visitForms,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey, queryFn: () => fetchWaitingRoomVisitForms() });

  const columns = useMemo<MRTColumnDef<IWaitingRoomVisitFormDTO>[]>(
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
        Cell: ({ row }: { row: MRTRow<IWaitingRoomVisitFormDTO> }) => (
          <WaitingRoomTableActionButtons
            visitFormId={row.original.id}
            queryKey={queryKey}
          />
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

export default WaitingRoomTablePage;
