import { Button } from "@mui/material";
import { compareAsc } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { RecentVisitsTableVisit } from "@app/model/visit";
import { RoutingPath } from "@app/routing-paths";
import { LocalizedError } from "@app/util/error-handling/LocalizedError";
import { fetchCurrentQuestions } from "@app/util/server_API/calls";
import type { QuestionDTO } from "@app/util/server_API/dto";
import { handleErrorsWithToast } from "@app/util/utils";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

const currentQuestionsIdComparator = (a: QuestionDTO, b: QuestionDTO) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

type RecentVisitsTableActionButtonsProps = {
  visit: RecentVisitsTableVisit;
};

export const RecentVisitsTableActionButtons = ({ visit }: RecentVisitsTableActionButtonsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onDuplicate = async () => {
    try {
      if (!visit.isPhantom) {
        // MAFILDB visit contains even those questions that are hidden in the form by the subject gender
        const currentQuestionsPromise = fetchCurrentQuestions();
        const visitQuestionIds = visit.answers.map((answer) => answer.questionId).sort();
        const currentQuestions = (await currentQuestionsPromise).sort(currentQuestionsIdComparator);

        // Check that current questions weren't modified after this visit was finalized
        if (
          currentQuestions.length !== visitQuestionIds.length
          || currentQuestions.some(
            (question, i) =>
              question.id !== visitQuestionIds[i] || compareAsc(question.updatedAt, visit.finalizationDate) === 1
          )
        ) {
          throw new LocalizedError("cannotDuplicateVisitDueToDifferentSafetyQuestions");
        }
      }

      navigate(`${RoutingPath.RECENT_VISITS_DUPLICATE}/${visit.uuid}`);
    } catch (error) {
      handleErrorsWithToast(error, t);
    }
  };

  // Don't allow actions if the visit is not complete
  if (
    visit.device === null
    || visit.finalizer === null
    || visit.subject.nativeLanguage === null
    // phantom visit does not have proband preferred language filled
    || (!visit.isPhantom && visit.subject.preferredLanguageCode === null)
  ) {
    return <>{t("recentVisitsTablePage.actions.incompleteVisit")}</>;
  }

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        href={`${RoutingPath.RECENT_VISITS_VISIT}/${visit.uuid}`}
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
