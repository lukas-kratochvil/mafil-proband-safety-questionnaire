import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useTranslation } from "react-i18next";
import { InteractingTable } from "@app/components/table/InteractingTable";
import { WaitingRoomActionButtons } from "@app/components/table/actions/WaitingRoomActionButtons";
import { defaultNS } from "@app/i18n";
import { IVisit } from "@app/interfaces/visit";
import { fetchWaitingRoomVisitForms } from "@app/util/fetch";

const createdAtFormat = "d.M.y H:mm";
const probandBirthdateFormat = "d.M.y";

const WaitingRoomTablePage = () => {
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
      maxSize: 0,
    },
    {
      accessorFn: (visit) => `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
      id: "proband",
      header: t("proband"),
      minSize: 150,
    },
    {
      accessorKey: "probandInfo.personalId",
      header: t("personalId"),
      maxSize: 0,
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
      maxSize: 0,
    },
    {
      accessorKey: "probandInfo.gender",
      header: t("gender"),
      maxSize: 0,
    },
    {
      accessorKey: "probandInfo.nativeLanguage",
      header: t("nativeLanguage"),
      maxSize: 0,
    },
    {
      id: "actionButtons",
      header: t("actions"),
      columnDefType: "display", // turns off data column features like sorting, filtering, etc.
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ row }: { row: MRTRow<IVisit> }) => <WaitingRoomActionButtons visitId={row.original.id} />,
      maxSize: 0,
    },
  ];

  return (
    <InteractingTable
      titleLocalizationKey="waitingRoomTablePage.title"
      header={header}
      queryKey="waitingRoomVisitForms"
      fetchVisits={fetchWaitingRoomVisitForms}
    />
  );
};

export default WaitingRoomTablePage;
