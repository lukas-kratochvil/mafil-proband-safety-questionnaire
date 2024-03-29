import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { defaultNS } from "@app/i18n";
import { RoutingPath } from "@app/routing-paths";
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
        onClick={() => navigate(`${RoutingPath.APPROVAL_ROOM_FORM}/${visitFormId}`)}
      >
        {t("showButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
