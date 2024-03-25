import { Box, useMediaQuery, type Theme } from "@mui/material";

export const CeitecMafilLogo = () => {
  const matchesOnlyXsBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.only("xs"));

  return (
    <Box display="flex">
      <Box
        component="img"
        alt="CEITEC-MAFIL logo"
        src="/logo_mafil.png"
        sx={{ height: matchesOnlyXsBreakpoint ? "2.25rem" : "3rem" }}
      />
    </Box>
  );
};
