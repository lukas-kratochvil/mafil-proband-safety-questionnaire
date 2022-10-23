import { Typography } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IVisit } from "../../data/visit_data";
import { defaultNS } from "../../i18n";
import { PageContainer } from "../../pages/PageContainer";
import { convertStringToLocalizationKey } from "../../util/utils";

interface IInteractingTableProps {
  titleLocalizationKey: string;
  header: MRTColumnDef<IVisit>[];
  fetchVisits: () => Promise<IVisit[]>;
}

export const InteractingTable = ({ titleLocalizationKey, header, fetchVisits }: IInteractingTableProps) => {
  const { t } = useTranslation(defaultNS);
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
