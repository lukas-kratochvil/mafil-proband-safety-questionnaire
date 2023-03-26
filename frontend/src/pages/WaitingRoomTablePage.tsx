import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WaitingRoomActionButtons } from "@app/components/table/actions/WaitingRoomActionButtons";
import { defaultTableProps } from "@app/components/table/table-default-props";
import { defaultNS } from "@app/i18n";
import { IWaitingRoomVisitFormDTO } from "@app/util/server_API/dto";
import { fetchWaitingRoomVisitForms } from "@app/util/server_API/fetch";
import { PageContainer } from "./PageContainer";

const createdAtFormat = "d.M.y H:mm";
const probandBirthdateFormat = "d.M.y";

const WaitingRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage" });
  const {
    data: visitForms,
    isFetching,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["waitingRoomVisitForms"], queryFn: () => fetchWaitingRoomVisitForms() });

  const columns = useMemo<MRTColumnDef<IWaitingRoomVisitFormDTO>[]>(
    () => [
      {
        accessorFn: (visit) => (visit.createdAt === undefined ? "" : format(visit.createdAt, createdAtFormat)),
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
        accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
        id: "proband",
        header: t("header.proband"),
        minSize: 150,
      },
      {
        accessorKey: "probandInfo.personalId",
        header: t("header.personalId"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) => format(visit.probandInfo.birthdate, probandBirthdateFormat),
        id: "probandInfo.birthdate",
        header: t("header.birthdate"),
        sortingFn: (rowA, rowB, columnId) =>
          compareAsc(
            parse(`${rowA.getValue(columnId)}`, probandBirthdateFormat, new Date()),
            parse(`${rowB.getValue(columnId)}`, probandBirthdateFormat, new Date())
          ),
        maxSize: 0,
      },
      {
        accessorFn: (visit) =>
          visit.probandInfo.gender.translations.find((trans) => trans.language.code === "cs")?.text
          || visit.probandInfo.gender.translations[0].text,
        id: "probandInfo.gender",
        header: t("header.gender"),
        maxSize: 0,
      },
      {
        accessorFn: (visit) =>
          visit.probandInfo.nativeLanguage.translations.find((trans) => trans.language.code === "cs")?.text
          || visit.probandInfo.nativeLanguage.translations[0].text,
        id: "probandInfo.nativeLanguage",
        header: t("header.nativeLanguage"),
        maxSize: 0,
      },
      {
        id: "actionButtons",
        header: t("header.actions"),
        columnDefType: "display", // turns off data column features like sorting, filtering, etc.
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }: { row: MRTRow<IWaitingRoomVisitFormDTO> }) => (
          <WaitingRoomActionButtons visitId={row.original.id} />
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
