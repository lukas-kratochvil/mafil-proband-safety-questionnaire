import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";

interface IInfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: IInfoTooltipProps) => (
  <Tooltip
    title={text}
    arrow
    placement="top-start"
  >
    <InfoIcon sx={{ color: "#2da2e1" }} />
  </Tooltip>
);
