import { Button } from "@mui/material";
import { compareAsc } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { IRecentVisitsTableVisit } from "@app/model/visit";
import { RoutingPaths } from "@app/routing-paths";
import { LocalizedError } from "@app/util/error-handling/LocalizedError";
import { fetchCurrentQuestions } from "@app/util/server_API/calls";
import { handleErrorsWithToast } from "@app/util/utils";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IRecentVisitsTableActionButtonsProps {
  visit: IRecentVisitsTableVisit;
}

export const RecentVisitsTableActionButtons = ({ visit }: IRecentVisitsTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage.actions" });
  const navigate = useNavigate();

  const onDuplicate = async () => {
    try {
      if (!visit.isPhantom) {
        const currentQuestions = await fetchCurrentQuestions();
        const visitQuestionIds = visit.answers.map((answer) => answer.questionId);

        if (
          currentQuestions.length !== visitQuestionIds.length
          || currentQuestions.some(
            (currentQuestion) =>
              !visitQuestionIds.includes(currentQuestion.id) || compareAsc(currentQuestion.updatedAt, visit.date) !== 1
          )
        ) {
          throw new LocalizedError("cannotDuplicateVisitDueToDifferentSafetyQuestions");
        }
      }

      navigate(`${RoutingPaths.RECENT_VISITS}/duplicate/${visit.visitId}`);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }
  };

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
        onClick={onDuplicate}
      >
        {t("duplicateButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
