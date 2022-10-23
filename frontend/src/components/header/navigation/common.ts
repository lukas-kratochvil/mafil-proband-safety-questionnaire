import { SvgIconComponent } from "@mui/icons-material";
import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { SxProps, Theme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { Location, NavigateFunction } from "react-router-dom";
import { UrlBasePaths } from "../../../App";

export const TAB_DEFAULT_COLOR = amber[700];
export const TAB_HIGHLIGHT_COLOR = amber[600];

export const isTabSelected = (location: Location, urlPrefix: UrlBasePaths): boolean =>
  location.pathname.startsWith(urlPrefix);

export const getCommonTabSx = (location: Location, urlPrefix: UrlBasePaths): SxProps<Theme> => {
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
  urlPrefix: UrlBasePaths;
  onClick: () => void;
  Icon: SvgIconComponent;
  showCount?: boolean;
}

export const getTabs = (navigate: NavigateFunction): ITabProps[] => [
  {
    localizationKey: "waitingRoom",
    urlPrefix: UrlBasePaths.WAITING_ROOM,
    onClick: () => navigate(UrlBasePaths.WAITING_ROOM),
    Icon: PendingActionsIcon,
    showCount: true,
  },
  {
    localizationKey: "approvalRoom",
    urlPrefix: UrlBasePaths.APPROVAL_ROOM,
    onClick: () => navigate(UrlBasePaths.APPROVAL_ROOM),
    Icon: ApprovalIcon,
    showCount: true,
  },
  {
    localizationKey: "recentVisits",
    urlPrefix: UrlBasePaths.RECENT_VISITS,
    onClick: () => navigate(UrlBasePaths.RECENT_VISITS),
    Icon: RecentActorsIcon,
  },
  {
    localizationKey: "createNewPhantomForm",
    urlPrefix: UrlBasePaths.PHANTOM_FORM,
    onClick: () => navigate(UrlBasePaths.PHANTOM_FORM),
    Icon: ScienceIcon,
  },
  {
    localizationKey: "openNewProbandForm",
    urlPrefix: UrlBasePaths.PROBAND_FORM,
    onClick: () => window.open(UrlBasePaths.PROBAND_FORM, "_blank", "noopener,noreferrer"),
    Icon: PersonAddAlt1Icon,
  },
];
