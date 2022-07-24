import { Grid, Typography } from "@mui/material";
import { FormCard } from "./FormCard";

interface ITextProps {
  text: string
}

const Text = ({ text }: ITextProps) => {
  return (
    <Typography
      style={{
        display: "inline-block",
      }}
    >
      {text}
    </Typography>
  );
}

interface IContentCellProps {
  title: string;
  element: JSX.Element;
}

const ContentCell = ({ title, element }: IContentCellProps) => {
  return (
    <Grid
      container
      padding={2}
      alignItems="center"
      gap={2}
    >
      <Typography
        style={{
          display: "inline-block",
          fontWeight: "bold",
        }}
      >
        {title}:
      </Typography>
      {element}
    </Grid>
  );
}

export const FormHeader = () => {
  return (
    <FormCard mainGridPadding={0}>
      <Grid
        item
        xs={10}
        borderBottom={1}
        borderRight={1}
      >
        <ContentCell title="Projekt" element={<Text text="Jméno projektu" />} />
      </Grid>
      <Grid
        item
        xs={2}
        borderBottom={1}
      >
        <ContentCell title="Fantom" element={<Text text="N" />} />
      </Grid>

      <Grid
        item
        xs={7}
        borderRight={1}
      >
        <ContentCell title="Přístroj" element={<Text text="Magnet 1" />} />
      </Grid>
      <Grid
        item
        xs={5}
      >
        <ContentCell title="Datum měření" element={<Text text={new Date().toDateString()} />} />
      </Grid>
    </FormCard>
  );
}
