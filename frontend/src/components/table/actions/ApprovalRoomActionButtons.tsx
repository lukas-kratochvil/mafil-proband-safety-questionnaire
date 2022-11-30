import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "@App";
import { defaultNS } from "@i18n";
import { ActionButtonsContainer, IActionButtonsProps } from "./ActionButtonsContainer";

export const ApprovalRoomActionButtons = ({ visitId }: IActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage.actions" });
  const navigate = useNavigate();

  return (
    <ActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${UrlBasePaths.APPROVAL_ROOM}/form/${visitId}`)}
      >
        {t("showButton")}
      </Button>
    </ActionButtonsContainer>
  );
};
