import { Autocomplete, Checkbox, Grid, TextField, Typography } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { magnets, projects } from "./data";
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

interface IFormAutocompleteProps {
  options: string[];
}

const FormAutocomplete = ({ options }: IFormAutocompleteProps) => {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} size="small" />}
      sx={{
        width: "100%"
      }}
    />
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
      height="100%"
      direction="row"
      flexWrap="nowrap"
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

interface IFormProjectInfoProps {
  isEditing: boolean;
}

export const FormProjectInfo = ({ isEditing }: IFormProjectInfoProps) => {
  const [examinationDate, setExaminationDate] = useState<Date | null>(new Date());

  const handleExaminationDate = (newValue: Date | null) => setExaminationDate(newValue);

  return (
    <FormCard mainGridPadding={0}>
      <Grid
        item
        xs={10}
        borderBottom={1}
        borderRight={1}
      >
        <ContentCell
          title="Projekt"
          element={
            isEditing
              ? <FormAutocomplete options={projects} />
              : <Text text="Jméno projektu" />
          }
        />
      </Grid>
      <Grid
        item
        xs={2}
        borderBottom={1}
      >
        <ContentCell
          title="Fantom"
          element={
            isEditing
              ? <Checkbox />
              : <Text text="N" />
          }
        />
      </Grid>

      <Grid
        item
        xs={8}
        borderRight={1}
      >
        <ContentCell
          title="Přístroj"
          element={
            isEditing
              ? <FormAutocomplete options={magnets} />
              : <Text text="N" />
          }
        />
      </Grid>
      <Grid
        item
        xs={4}
      >
        <ContentCell
          title="Datum měření"
          element={
            isEditing
              ? <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  inputFormat="dd/MM/yyyy"
                  value={examinationDate}
                  onChange={handleExaminationDate}
                  renderInput={(params) => <TextField {...params} size="small" sx={{ maxWidth: "10rem" }} />}
                />
              </LocalizationProvider>
              : <Text text={new Date().toDateString()} />
          }
        />
      </Grid>
    </FormCard>
  );
}
