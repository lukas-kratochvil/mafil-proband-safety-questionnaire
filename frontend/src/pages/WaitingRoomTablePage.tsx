import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useTranslation } from "react-i18next";
import { InteractingTable } from "../components/table/InteractingTable";
import { WaitingRoomActionButtons } from "../components/table/actions/WaitingRoomActionButtons";
import { IVisit } from "../data/visit_data";
import { defaultNS } from "../i18n";
import { fetchWaitingRoomVisits } from "../util/fetch";

const createdAtFormat = "d.M.yyyy H:mm";
const probandBirthdateFormat = "d.M.yyyy";

export const WaitingRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "waitingRoomTablePage.header" });

  const header: MRTColumnDef<IVisit>[] = [
    {
      accessorFn: (visit) => format(visit.createdAt, createdAtFormat),
      id: "createdAt",
      header: t("registrationDate"),
      sortingFn: (rowA, rowB, columnId) =>
        compareAsc(
          parse(`${rowA.getValue(columnId)}`, createdAtFormat, new Date()),
          parse(`${rowB.getValue(columnId)}`, createdAtFormat, new Date())
        ),
    },
    {
      accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
      id: "proband",
      header: t("proband"),
    },
    {
      accessorKey: "probandInfo.personalId",
      header: t("personalId"),
    },
    {
      accessorFn: (visit) => format(visit.probandInfo.birthdate, probandBirthdateFormat),
      id: "probandInfo.birthdate",
      header: t("birthdate"),
      sortingFn: (rowA, rowB, columnId) =>
        compareAsc(
          parse(`${rowA.getValue(columnId)}`, probandBirthdateFormat, new Date()),
          parse(`${rowB.getValue(columnId)}`, probandBirthdateFormat, new Date())
        ),
    },
    {
      accessorKey: "probandInfo.gender",
      header: t("gender"),
    },
    {
      accessorKey: "probandInfo.nativeLanguage",
      header: t("nativeLanguage"),
    },
    {
      id: "actionButtons",
      header: t("actions"),
      columnDefType: "display", // turns off data column features like sorting, filtering, etc.
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ row }: { row: MRTRow<IVisit> }) => <WaitingRoomActionButtons visitId={row.original.id} />,
    },
  ];

  return (
    <InteractingTable
      header={header}
      fetchVisits={fetchWaitingRoomVisits}
    />
  );
};
