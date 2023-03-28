import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { RoutingPaths } from "@app/routing-paths";
import { getDummyVisit } from "@app/util/fetch.dev";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IRecentVisitsTableActionButtonsProps {
  visitId: string;
}

export const RecentVisitsTableActionButtons = ({ visitId }: IRecentVisitsTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "recentVisitsTablePage.actions" });
  const navigate = useNavigate();

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPaths.RECENT_VISITS}/visit/${visitId}`)}
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
            navigate(`${RoutingPaths.RECENT_VISITS}/duplicate/${1}`);
          } else {
            navigate(`${RoutingPaths.RECENT_VISITS}/duplicate/${initialVisit.id}`);
          }
        }}
      >
        {t("duplicateButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
