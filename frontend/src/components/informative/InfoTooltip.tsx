import InfoIcon from "@mui/icons-material/Info";
import { ClickAwayListener, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

interface IInfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: IInfoTooltipProps) => {
  const theme = useTheme();
  const matchesPointerDevice = useMediaQuery("(pointer: fine)");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleTooltipClose = () => setIsOpen(false);
  const handleTooltipOpen = () => setIsOpen(true);

  return matchesPointerDevice ? (
    <Tooltip
      title={text}
      arrow
      placement="top-start"
    >
      <InfoIcon sx={{ color: theme.palette.info.light }} />
    </Tooltip>
  ) : (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={text}
        arrow
        placement="top-start"
        open={isOpen}
        onClose={handleTooltipClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <IconButton
          onClick={handleTooltipOpen}
          sx={{ marginRight: "-0.75rem" }}
        >
          <InfoIcon sx={{ color: theme.palette.info.light }} />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
