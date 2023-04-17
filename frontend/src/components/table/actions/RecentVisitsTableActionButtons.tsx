import { Button } from "@mui/material";
import { compareAsc } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { IRecentVisitsTableVisit } from "@app/model/visit";
import { RoutingPaths } from "@app/routing-paths";
import { fetchCurrentQuestions } from "@app/util/server_API/fetch";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IRecentVisitsTableActionButtonsProps {
  visit: IRecentVisitsTableVisit;
}

export const RecentVisitsTableActionButtons = ({ visit }: IRecentVisitsTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage.actions" });
  const navigate = useNavigate();

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPaths.RECENT_VISITS}/visit/${visit.visitId}`)}
      >
        {t("showDetailButton")}
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={async () => {
          if (!visit.isPhantom) {
            const currentQuestions = await fetchCurrentQuestions();
            const visitQuestionIds = visit.answers.map((answer) => answer.questionId);

            // TODO: add error boundary around the action buttons to show the error
            if (
              currentQuestions.length !== visitQuestionIds.length
              || currentQuestions.some(
                (currentQuestion) =>
                  !visitQuestionIds.includes(currentQuestion.id)
                  || compareAsc(currentQuestion.updatedAt, visit.date) !== 1
              )
            ) {
              // TODO: translate error message - firstly, try if this message is showed on the screen
              throw new Error("Visit questions differs from current questions! Visit cannot be duplicated.");
            }
          }

          navigate(`${RoutingPaths.RECENT_VISITS}/duplicate/${visit.visitId}`);
        }}
      >
        {t("duplicateButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
