import { Grid } from "@mui/material";
import { LogOutButton } from "./LogOutButton";
import { OperatorCard } from "./OperatorCard";

export const LoginOperator = () => (
  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <OperatorCard />
    <LogOutButton />
  </Grid>
);
