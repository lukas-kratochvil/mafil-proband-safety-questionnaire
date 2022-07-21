import { Grid, Typography } from "@mui/material";
import { FormCard } from "./FormCard";

interface IContentCellProps {
  title: String;
  value: String;
}

const ContentCell = ({ title, value }: IContentCellProps) => {
  return (
    <Grid padding={2}>
      <Typography
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
        }}
      >
        {title}:
      </Typography>
      <Typography
        style={{
          display: 'inline-block',
          marginLeft: 8,
        }}
      >
        {value}
      </Typography>
    </Grid>
  );
}

export const FormHeader = () => {
  return (
    <FormCard>
      <Grid container>
        <Grid
          item
          xs={10}
          borderBottom={1}
          borderRight={1}
        >
          <ContentCell title='Projekt' value='Jméno projektu' />
        </Grid>
        <Grid
          item
          xs={2}
          borderBottom={1}
        >
          <ContentCell title='Fantom' value='N' />
        </Grid>

        <Grid
          item
          xs={7}
          borderRight={1}
        >
          <ContentCell title='Přístroj' value='Magnet 1' />
        </Grid>
        <Grid
          item
          xs={5}
        >
          <ContentCell title='Datum měření' value={new Date().toDateString()} />
        </Grid>
      </Grid>
    </FormCard>
  );
}
