import { Typography } from "@mui/material";
import type {
  MRT_ColumnDef as MRTColumnDef,
  MRT_RowData as MRTRowData,
  MRT_SortingState as MRTSortingState,
} from "material-react-table";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { PageContainer } from "@app/pages/PageContainer";

type TablePageProps<T extends MRTRowData> = {
  title: string;
  columns: MRTColumnDef<T>[];
  data: T[] | undefined;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  defaultSorting: MRTSortingState;
};

export const TablePage = <T extends MRTRowData>({
  title,
  columns,
  data,
  isFetching,
  isLoading,
  isError,
  defaultSorting,
}: TablePageProps<T>) => {
  // FIXME: does not show more than 10 rows
  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
    enableDensityToggle: false,
    enableEditing: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableBottomToolbar: false,
    memoMode: "rows", // breaks some dynamic rendering features (read: https://www.material-react-table.com/docs/guides/memoize-components)
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    initialState: {
      sorting: defaultSorting,
    },
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
    renderTopToolbarCustomActions: () => (
      <Typography
        paddingLeft="0.5rem"
        fontSize="1.5rem"
        textTransform="uppercase"
      >
        {title}
      </Typography>
    ),
  });

  return (
    <PageContainer isTablePage>
      <MaterialReactTable table={table} />
    </PageContainer>
  );
};
