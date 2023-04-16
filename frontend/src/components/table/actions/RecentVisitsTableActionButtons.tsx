import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { IVisit } from "@app/model/visit";
import { RoutingPaths } from "@app/routing-paths";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IRecentVisitsTableActionButtonsProps {
  visit: IVisit;
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
        onClick={() => {
          // TODO: create new form (not in DB!) with the same data as the original form
          navigate(`${RoutingPaths.RECENT_VISITS}/duplicate/${visit.visitId}`);
        }}
      >
        {t("duplicateButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
