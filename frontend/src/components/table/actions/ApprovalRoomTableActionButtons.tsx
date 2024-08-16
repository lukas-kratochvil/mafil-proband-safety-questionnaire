import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RoutingPath } from "@app/routing-paths";
import { TableActionButtonsContainer } from "./TableActionButtonsContainer";

type ApprovalRoomTableActionButtonsProps = {
  visitFormId: string;
};

export const ApprovalRoomTableActionButtons = ({ visitFormId }: ApprovalRoomTableActionButtonsProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "approvalRoomTablePage.actions" });

  return (
    <TableActionButtonsContainer>
      <Button
        size="small"
        variant="contained"
        href={`${RoutingPath.APPROVAL_ROOM_FORM}/${visitFormId}`}
      >
        {t("showButton")}
      </Button>
    </TableActionButtonsContainer>
  );
};
