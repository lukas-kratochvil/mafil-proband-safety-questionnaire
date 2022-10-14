import { Box } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { IVisit } from "../../data/visit_data";
import { PageContainer } from "../../pages/PageContainer";

export interface IActionButtonsProps {
  visitId: string;
}

interface IInteractingTableProps {
  header: MRTColumnDef<IVisit>[];
  fetchVisits: () => Promise<IVisit[]>;
  ActionButtons: FunctionComponent<IActionButtonsProps>;
  actionButtonsSize: number;
}

export const InteractingTable = ({ header, fetchVisits, ActionButtons, actionButtonsSize }: IInteractingTableProps) => {
  const [visits, setVisits] = useState<IVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  useEffect(() => {
    const fetchTableVisits = async () => {
      if (visits.length === 0) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const fetchedVisits = await fetchVisits();
        setVisits(fetchedVisits);
        setShowSkeleton(false);
        setIsLoading(false);
        setIsRefetching(false);
      } catch (e) {
        setIsError(true);
      }
    };

    fetchTableVisits();
  }, [fetchVisits, visits.length]);

  const columns = useMemo<MRTColumnDef<IVisit>[]>(() => header, [header]);

  return (
    <PageContainer isTablePage>
      <MaterialReactTable
        columns={columns}
        data={visits}
        enableDensityToggle={false}
        enableEditing={false}
        enableColumnFilters={false}
        enableHiding={false}
        enableBottomToolbar={false}
        enableRowActions
        displayColumnDefOptions={{
          "mrt-row-actions": {
            size: actionButtonsSize, // change width of actions
          },
        }}
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <ActionButtons visitId={row.original.id} />
          </Box>
        )}
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
          showProgressBars: isRefetching,
          showSkeletons: showSkeleton,
        }}
      />
    </PageContainer>
  );
};
