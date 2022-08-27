import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IActionButtonsProps, VisitsTable } from "../components/table/VisitsTable";
import { IProbandVisit, VisitState } from "../data/visit_data";
import { fetchRecentVisits } from "../util/utils";

const recentVisitsHeader = ["Visit ID", "Proband", "Projekt", "Přístroj", "Zpracováno", "Zpracoval", "Podepsáno"];

const getRecentVisitsRow = (visit: IProbandVisit): string[] => {
  let isSignedText = "";

  if (visit.state === VisitState.SIGNED) {
    isSignedText = "Ano";
  } else if (visit.state === VisitState.CHECKED) {
    isSignedText = "Ne";
  }

  return [
    visit.visitId,
    `${visit.probandInfo.surname}, ${visit.probandInfo.name}`,
    visit.projectInfo.projectId,
    visit.projectInfo.magnetDeviceId,
    new Date().toDateString(),
    "MUNI_operator",
    isSignedText,
  ];
};

const RecentVisitsActionButtons = ({ visitId }: IActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigate(`/auth/visit-detail/${visitId}`)}
      >
        Zobrazit detail
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          // TODO: create new form with the same data as the original form
          const newVisitId = 1;
          navigate(`/auth/form/${newVisitId}`);
        }}
      >
        Duplikovat
      </Button>
    </>
  );
};

export const RecentVisitsTablePage = () => (
  <VisitsTable
    header={recentVisitsHeader}
    fetchVisits={fetchRecentVisits}
    getVisitRow={getRecentVisitsRow}
    ActionButtons={RecentVisitsActionButtons}
  />
);
