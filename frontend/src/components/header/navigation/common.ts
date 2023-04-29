import { SvgIconComponent } from "@mui/icons-material";
import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { SxProps, Theme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { Location, NavigateFunction } from "react-router-dom";
import { RoutingPath } from "@app/routing-paths";

export const TAB_DEFAULT_COLOR = amber[700];
export const TAB_HIGHLIGHT_COLOR = amber[600];

export const isTabSelected = (location: Location, urlPrefix: RoutingPath): boolean =>
  location.pathname.startsWith(urlPrefix);

export const getCommonTabSx = (location: Location, urlPrefix: RoutingPath): SxProps<Theme> => {
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
  urlPrefix: RoutingPath;
  onClick: () => void;
  Icon: SvgIconComponent;
}

export const getTabs = (navigate: NavigateFunction): ITabProps[] => [
  {
    localizationKey: "waitingRoom",
    urlPrefix: RoutingPath.WAITING_ROOM,
    onClick: () => navigate(RoutingPath.WAITING_ROOM),
    Icon: PendingActionsIcon,
  },
  {
    localizationKey: "approvalRoom",
    urlPrefix: RoutingPath.APPROVAL_ROOM,
    onClick: () => navigate(RoutingPath.APPROVAL_ROOM),
    Icon: ApprovalIcon,
  },
  {
    localizationKey: "recentVisits",
    urlPrefix: RoutingPath.RECENT_VISITS,
    onClick: () => navigate(RoutingPath.RECENT_VISITS),
    Icon: RecentActorsIcon,
  },
  {
    localizationKey: "createNewPhantomForm",
    urlPrefix: RoutingPath.PHANTOM_FORM,
    onClick: () => navigate(RoutingPath.PHANTOM_FORM),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "openNewProbandForm",
    urlPrefix: RoutingPath.PROBAND_FORM,
    onClick: () => window.open(RoutingPath.PROBAND_FORM, "_blank", "noopener,noreferrer"),
    Icon: PersonAddAlt1Icon,
  },
];
