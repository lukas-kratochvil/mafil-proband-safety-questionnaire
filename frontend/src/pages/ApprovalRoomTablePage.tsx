import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef, MRT_Row as MRTRow } from "material-react-table";
import { useTranslation } from "react-i18next";
import { InteractingTable } from "@components/table/InteractingTable";
import { ApprovalRoomActionButtons } from "@components/table/actions/ApprovalRoomActionButtons";
import { defaultNS } from "@i18n";
import { IVisit } from "@interfaces/visit";
import { fetchApprovalRoomVisits } from "@util/fetch";

const createdAtFormat = "d.M.y H:mm";
const probandBirthdateFormat = "d.M.y";

const ApprovalRoomTablePage = () => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage.header" });

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
      accessorKey: "projectInfo.project",
      header: t("project"),
      minSize: 300,
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
      Cell: ({ row }: { row: MRTRow<IVisit> }) => <ApprovalRoomActionButtons visitId={row.original.id} />,
      maxSize: 0,
    },
  ];

  return (
    <InteractingTable
      titleLocalizationKey="approvalRoomTablePage.title"
      header={header}
      fetchVisits={fetchApprovalRoomVisits}
    />
  );
};

export default ApprovalRoomTablePage;
