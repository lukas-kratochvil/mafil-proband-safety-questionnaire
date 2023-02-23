import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { RoutingPaths } from "@app/routing-paths";
import { ActionButtonsContainer, IActionButtonsProps } from "./ActionButtonsContainer";

export const ApprovalRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage.actions" });
  const navigate = useNavigate();

  return (
    <ActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPaths.APPROVAL_ROOM}/form/${visitId}`)}
      >
        {t("showButton")}
      </Button>
    </ActionButtonsContainer>
  );
};
