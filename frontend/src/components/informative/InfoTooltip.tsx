import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, useTheme } from "@mui/material";

interface IInfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: IInfoTooltipProps) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={text}
      arrow
      placement="top-start"
    >
      <InfoIcon sx={{ color: theme.palette.info.light }} />
    </Tooltip>
  );
};
