import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { IVisit } from "../../data/visit_data";
import { PageContainer } from "../../pages/PageContainer";

interface IInteractingTableProps {
  header: MRTColumnDef<IVisit>[];
  fetchVisits: () => Promise<IVisit[]>;
}

export const InteractingTable = ({ header, fetchVisits }: IInteractingTableProps) => {
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
          showProgressBars: isRefetching,
          showSkeletons: showSkeleton,
        }}
      />
    </PageContainer>
  );
};
