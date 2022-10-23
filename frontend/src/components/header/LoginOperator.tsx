import { Grid } from "@mui/material";
import { LogOutButton } from "./LogOutButton";
import { OperatorCard } from "./OperatorCard";

export const LoginOperator = () => (
  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
    gap="1rem"
  >
    <Grid item>
      <OperatorCard />
    </Grid>
    <Grid item>
      <LogOutButton />
    </Grid>
  </Grid>
);
