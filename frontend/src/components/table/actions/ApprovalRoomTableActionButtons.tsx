import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { RoutingPaths } from "@app/routing-paths";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

interface IApprovalRoomTableActionButtonsProps {
  visitFormId: string;
}

export const ApprovalRoomTableActionButtons = ({ visitFormId }: IApprovalRoomTableActionButtonsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "approvalRoomTablePage.actions" });
  const navigate = useNavigate();

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`${RoutingPaths.APPROVAL_ROOM}/form/${visitFormId}`)}
      >
        {t("showButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
