import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { compareAsc, format, parse } from "date-fns";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ApprovalRoomActionButtons } from "@app/components/table/actions/ApprovalRoomActionButtons";
import { defaultNS } from "@app/i18n";
import { IApprovalRoomVisitFormDTO } from "@app/util/server_API/dto";
import { fetchApprovalRoomVisitForms } from "@app/util/server_API/fetch";
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
        accessorKey: "additionalInfo.projectAcronym",
        header: t("header.project"),
        minSize: 300,
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
        Cell: ({ row }: { row: MRTRow<IApprovalRoomVisitFormDTO> }) => (
          <ApprovalRoomActionButtons visitId={row.original.id} />
        ),
        maxSize: 0,
      },
    ],
    [t]
  );

  return (
    <PageContainer isTablePage>
      <MaterialReactTable
        columns={columns}
        data={visitForms || []}
        enableDensityToggle={false}
        enableEditing={false}
        enableColumnFilters={false}
        enableHiding={false}
        enableBottomToolbar={false}
        memoMode="rows" // breaks some dynamic rendering features (read: https://www.material-react-table.com/docs/guides/memoize-components)
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        renderTopToolbarCustomActions={() => (
          <Typography
            paddingLeft="0.5rem"
            fontSize="1.5rem"
            textTransform="uppercase"
          >
            {t("title")}
          </Typography>
        )}
      />
    </PageContainer>
  );
};

export default ApprovalRoomTablePage;
