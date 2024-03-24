import { Button } from "@mui/material";
import { compareAsc } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n/i18n";
import type { IRecentVisitsTableVisit } from "@app/model/visit";
import { RoutingPath } from "@app/routing-paths";
import { LocalizedError } from "@app/util/error-handling/LocalizedError";
import { fetchCurrentQuestions } from "@app/util/server_API/calls";
import { handleErrorsWithToast } from "@app/util/utils";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IRecentVisitsTableActionButtonsProps {
  visit: IRecentVisitsTableVisit;
}

export const RecentVisitsTableActionButtons = ({ visit }: IRecentVisitsTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS);
  const navigate = useNavigate();

  const onDuplicate = async () => {
    try {
      if (!visit.isPhantom) {
        const currentQuestions = await fetchCurrentQuestions();
        const visitQuestionIds = visit.answers.map((answer) => answer.questionId);

        // Check that current questions weren't modified after this visit was created in the MAFILDB
        if (
          currentQuestions.length !== visitQuestionIds.length
          || currentQuestions.some(
            (currentQuestion) =>
              !visitQuestionIds.includes(currentQuestion.id)
              || compareAsc(currentQuestion.updatedAt, visit.created) !== 1
          )
        ) {
          throw new LocalizedError("cannotDuplicateVisitDueToDifferentSafetyQuestions");
        }
      }

      navigate(`${RoutingPath.RECENT_VISITS_DUPLICATE}/${visit.visitId}`);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }
  };

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPath.RECENT_VISITS_VISIT}/${visit.visitId}`)}
      >
        {t("recentVisitsTablePage.actions.showDetailButton")}
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={onDuplicate}
      >
        {t("recentVisitsTablePage.actions.duplicateButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
