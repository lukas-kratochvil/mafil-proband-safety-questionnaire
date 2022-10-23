import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../../App";
import { defaultNS } from "../../../i18n";
import { getDummyVisit } from "../../../util/fetch.dev";
import { ActionButtonsContainer, IActionButtonsProps } from "./ActionButtonsContainer";

export const RecentVisitsActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage.actions" });
  const navigate = useNavigate();

  return (
    <ActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${UrlBasePaths.RECENT_VISITS}/visit/${visitId}`)}
      >
        {t("showDetailButton")}
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          // TODO: create new form (not in DB!) with the same data as the original form
          const initialVisit = getDummyVisit(visitId);

          if (initialVisit === undefined) {
            // TODO: show some error instead!
            navigate(`${UrlBasePaths.RECENT_VISITS}/duplicate/${1}`);
          } else {
            navigate(`${UrlBasePaths.RECENT_VISITS}/duplicate/${initialVisit.id}`);
          }
        }}
      >
        {t("duplicateButton")}
      </Button>
    </ActionButtonsContainer>
  );
};
