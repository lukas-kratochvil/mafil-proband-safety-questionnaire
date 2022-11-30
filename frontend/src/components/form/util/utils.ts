import { NavigateFunction } from "react-router-dom";
import { VisitState } from "@interfaces/visit";
import { RoutingPaths } from "@routing-paths";
import { updateDummyVisitState } from "@util/fetch.dev";
import { IButtonProps } from "../FormButtons";

export const getDisapproveButtonProps = (id: string | undefined, navigate: NavigateFunction): IButtonProps => ({
  titleLocalizationKey: "form.common.buttons.disapprove",
  onClick: () => {
    // TODO: store changes in DB if made
    updateDummyVisitState(id, VisitState.DISAPPROVED);
    navigate(RoutingPaths.APPROVAL_ROOM);
  },
  showErrorColor: true,
});
