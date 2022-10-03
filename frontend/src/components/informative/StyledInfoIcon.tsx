import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material";

export const StyledInfoIcon = () => {
  const theme = useTheme();
  return <InfoIcon sx={{ color: theme.palette.info.light }} />;
};
