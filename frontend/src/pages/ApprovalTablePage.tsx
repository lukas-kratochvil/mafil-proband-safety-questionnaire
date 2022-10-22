import { Button } from "@mui/material";
import { compareAsc, format, parse } from "date-fns";
import { MRT_ColumnDef as MRTColumnDef } from "material-react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../App";
import { IActionButtonsProps, InteractingTable } from "../components/table/InteractingTable";
import { IVisit } from "../data/visit_data";
import { defaultNS } from "../i18n";
import { fetchApprovalVisits } from "../util/fetch";

const ApprovalActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage.actions" });
  const navigate = useNavigate();

  return (
    <Button
      size="small"
      variant="contained"
      onClick={() => navigate(`${UrlBasePaths.APPROVAL}/form/${visitId}`)}
    >
      {t("showButton")}
    </Button>
  );
};

const createdAtFormat = "d.M.yyyy H:mm";
const probandBirthdateFormat = "d.M.yyyy";

export const ApprovalTablePage = () => {
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
    },
    {
      accessorKey: "projectInfo.project",
      header: t("project"),
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
  ];

  return (
    <InteractingTable
      header={header}
      fetchVisits={fetchApprovalVisits}
      ActionButtons={ApprovalActionButtons}
      actionButtonsSize={100}
    />
  );
};
