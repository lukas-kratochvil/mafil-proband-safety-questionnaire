import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { IVisit } from "@app/model/visit";
import { PageContainer } from "@app/pages/PageContainer";
import { convertStringToLocalizationKey } from "@app/util/utils";

interface IInteractingTableProps {
  titleLocalizationKey: string;
  header: MRTColumnDef<IVisit>[];
  queryKey: string;
  fetchVisits: () => Promise<IVisit[]>;
}

export const InteractingTable = ({ titleLocalizationKey, header, queryKey, fetchVisits }: IInteractingTableProps) => {
  const {
    data: visits,
    isFetching,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchVisits(),
  });
  const { t } = useTranslation(defaultNS);

  const columns = useMemo<MRTColumnDef<IVisit>[]>(() => header, [header]);

  return (
    <PageContainer isTablePage>
      <MaterialReactTable
        columns={columns}
        data={visits || []}
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
            {t(convertStringToLocalizationKey(titleLocalizationKey))}
          </Typography>
        )}
      />
    </PageContainer>
  );
};
