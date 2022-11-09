import { NavigateFunction } from "react-router-dom";
import { UrlBasePaths } from "../../../App";
import { VisitState } from "../../../interfaces/visit";
import { updateDummyVisitState } from "../../../util/fetch.dev";
import { IButtonProps } from "../FormButtons";

export const getDisapproveButtonProps = (id: string | undefined, navigate: NavigateFunction): IButtonProps => ({
  titleLocalizationKey: "form.common.buttons.disapprove",
  onClick: () => {
    // TODO: store changes in DB if made
    updateDummyVisitState(id, VisitState.DISAPPROVED);
    navigate(UrlBasePaths.APPROVAL_ROOM);
  },
  showErrorColor: true,
});
