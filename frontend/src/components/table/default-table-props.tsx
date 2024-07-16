import { Typography } from "@mui/material";
import type { MaterialReactTableProps, MRT_ColumnDef as MRTColumnDef } from "material-react-table";

export type DefaultSorting = {
  /** Column id */
  id: string;
  desc: boolean;
}[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultTableProps = <T extends Record<string, any>>(
  title: string,
  columns: MRTColumnDef<T>[],
  data: T[] | undefined,
  isFetching: boolean,
  isLoading: boolean,
  isError: boolean,
  defaultSorting: DefaultSorting
): MaterialReactTableProps<T> => ({
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
