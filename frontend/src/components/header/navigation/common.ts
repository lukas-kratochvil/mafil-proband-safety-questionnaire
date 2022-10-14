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

export const isTabSelected = (location: Location, urlPrefix: string): boolean =>
  location.pathname.startsWith(urlPrefix);

export const getCommonTabSx = (theme: Theme, location: Location, urlPrefix: string): SxProps<Theme> => {
  const isSelected = isTabSelected(location, urlPrefix);

  return {
    color: theme.palette.text.primary,
    backgroundColor: isSelected ? TAB_HIGHLIGHT_COLOR : undefined,
    opacity: isSelected ? 1 : 0.85,
    fontSize: "0.85rem",
    fontWeight: 500,
    letterSpacing: "0.02857rem",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: TAB_HIGHLIGHT_COLOR,
      opacity: 1,
    },
  };
};

export interface ITabProps {
  urlPrefix: string;
  label: string;
  onClick: () => void;
  Icon: SvgIconComponent;
}

export const getTabs = (navigate: NavigateFunction): ITabProps[] => [
  {
    urlPrefix: UrlBasePaths.WAITING_ROOM,
    // TODO: number must be updated
    label: "Čekárna (?)",
    onClick: () => navigate(UrlBasePaths.WAITING_ROOM),
    Icon: PendingActionsIcon,
  },
  {
    urlPrefix: UrlBasePaths.APPROVAL,
    // TODO: number must be updated
    label: "Ke schválení (?)",
    onClick: () => navigate(UrlBasePaths.APPROVAL),
    Icon: ApprovalIcon,
  },
  {
    urlPrefix: UrlBasePaths.RECENT_VISITS,
    label: "Poslední visity",
    onClick: () => navigate(UrlBasePaths.RECENT_VISITS),
    Icon: RecentActorsIcon,
  },
  {
    urlPrefix: UrlBasePaths.FANTOM_FORM,
    label: "Založit měření na Fantomu",
    onClick: () => navigate(UrlBasePaths.FANTOM_FORM),
    Icon: ScienceIcon,
  },
  {
    urlPrefix: UrlBasePaths.PROBAND_FORM,
    label: "Otevřít formulář probanda",
    onClick: () => window.open(UrlBasePaths.PROBAND_FORM, "_blank", "noopener,noreferrer"),
    Icon: PersonAddAlt1Icon,
  },
];
