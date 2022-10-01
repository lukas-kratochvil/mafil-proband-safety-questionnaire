import { Box, useMediaQuery, useTheme } from "@mui/material";

export const CeitecMafilLogo = () => {
  const theme = useTheme();
  const matchesOnlyXsBreakpoint = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box display="flex">
      <Box
        component="img"
        alt="CEITEC-MAFIL logo"
        src="/logo_mafil.png"
        sx={{ height: matchesOnlyXsBreakpoint ? "2.25rem" : "3rem" }} />
    </Box>
  );
};
