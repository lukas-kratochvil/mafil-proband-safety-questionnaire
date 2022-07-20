import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";

export const MainContainer = ({ children }: PropsWithChildren) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      // TODO: minHeight will be different depending if user is proband or operator (top-menu is operator-specific)
      minHeight="calc(100vh - 64px - 50px)" // 64px header, 50px top-menu
    >
      {children}
    </Grid>
  );
}
