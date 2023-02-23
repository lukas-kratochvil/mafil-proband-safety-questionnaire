import { SvgIconComponent } from "@mui/icons-material";
import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { SxProps, Theme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { Location, NavigateFunction } from "react-router-dom";
import { RoutingPaths } from "@app/routing-paths";

export const TAB_DEFAULT_COLOR = amber[700];
export const TAB_HIGHLIGHT_COLOR = amber[600];

export const isTabSelected = (location: Location, urlPrefix: RoutingPaths): boolean =>
  location.pathname.startsWith(urlPrefix);

export const getCommonTabSx = (location: Location, urlPrefix: RoutingPaths): SxProps<Theme> => {
  const isSelected = isTabSelected(location, urlPrefix);

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

export interface ITabProps {
  localizationKey: string;
  urlPrefix: RoutingPaths;
  onClick: () => void;
  Icon: SvgIconComponent;
  showCount?: boolean;
}

export const getTabs = (navigate: NavigateFunction): ITabProps[] => [
  {
    localizationKey: "waitingRoom",
    urlPrefix: RoutingPaths.WAITING_ROOM,
    onClick: () => navigate(RoutingPaths.WAITING_ROOM),
    Icon: PendingActionsIcon,
    showCount: true,
  },
  {
    localizationKey: "approvalRoom",
    urlPrefix: RoutingPaths.APPROVAL_ROOM,
    onClick: () => navigate(RoutingPaths.APPROVAL_ROOM),
    Icon: ApprovalIcon,
    showCount: true,
  },
  {
    localizationKey: "recentVisits",
    urlPrefix: RoutingPaths.RECENT_VISITS,
    onClick: () => navigate(RoutingPaths.RECENT_VISITS),
    Icon: RecentActorsIcon,
  },
  {
    localizationKey: "createNewPhantomForm",
    urlPrefix: RoutingPaths.PHANTOM_FORM,
    onClick: () => navigate(RoutingPaths.PHANTOM_FORM),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "openNewProbandForm",
    urlPrefix: RoutingPaths.PROBAND_FORM,
    onClick: () => window.open(RoutingPaths.PROBAND_FORM, "_blank", "noopener,noreferrer"),
    Icon: PersonAddAlt1Icon,
  },
];
