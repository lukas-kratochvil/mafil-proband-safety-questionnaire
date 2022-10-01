import InfoIcon from "@mui/icons-material/Info";
import { ClickAwayListener, IconButton, styled, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

const StyledInfoIcon = styled(InfoIcon)(() => {
  const theme = useTheme();
  return { color: theme.palette.info.light };
}) as typeof InfoIcon;

interface IInfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: IInfoTooltipProps) => {
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
      <StyledInfoIcon />
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
          sx={{
            // margin is placing the info button the same way as is the info icon placed for pointer devices
            marginX: "-0.5rem",
          }}
        >
          <StyledInfoIcon />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
