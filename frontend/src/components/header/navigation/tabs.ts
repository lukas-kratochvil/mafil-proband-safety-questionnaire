import type { SvgIconComponent } from "@mui/icons-material";
import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import type { SxProps, Theme } from "@mui/material";
import { amber } from "@mui/material/colors";
import type { Location } from "react-router-dom";
import { RoutingPath } from "@app/routing-paths";

export const TAB_DEFAULT_COLOR = amber[700];
const TAB_HIGHLIGHT_COLOR = amber[600];

/**
 * Basic tab properties to be used in this app.
 */
export type TabProps = {
  localizationKey: string;
  urlPath: RoutingPath;
  Icon: SvgIconComponent;
  openInNewWindow?: boolean;
};

/**
 * Returns common tab style for a MUI tab component.
 */
export const getCommonTabSx = (location: Location, urlPath: TabProps["urlPath"]): SxProps<Theme> => {
  const isSelected = location.pathname.startsWith(urlPath);

  return {
    color: ({ palette }) => palette.text.primary,
    bgcolor: isSelected ? TAB_HIGHLIGHT_COLOR : undefined,
    opacity: isSelected ? 1 : 0.85,
    fontSize: "0.85rem",
    fontWeight: 500,
    letterSpacing: "0.02857rem",
    textTransform: "uppercase",
    "&:hover": {
      bgcolor: TAB_HIGHLIGHT_COLOR,
      opacity: 1,
    },
  };
};

/**
 * Returns all tabs to be used in this app.
 */
export const getTabs = (): TabProps[] => [
  {
    localizationKey: "waitingRoom",
    urlPath: RoutingPath.WAITING_ROOM,
    Icon: PendingActionsIcon,
  },
  {
    localizationKey: "approvalRoom",
    urlPath: RoutingPath.APPROVAL_ROOM,
    Icon: ApprovalIcon,
  },
  {
    localizationKey: "recentVisits",
    urlPath: RoutingPath.RECENT_VISITS,
    Icon: RecentActorsIcon,
  },
  {
    localizationKey: "createNewPhantomForm",
    urlPath: RoutingPath.PHANTOM_FORM,
    Icon: ScienceIcon,
  },
  {
    localizationKey: "openNewProbandForm",
    urlPath: RoutingPath.PROBAND_FORM,
    Icon: PersonAddAlt1Icon,
    openInNewWindow: true,
  },
];
