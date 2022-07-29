import { Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import { magnets, projects } from "../../data/form_data";
import { FormCard } from "./FormCard";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormAutocomplete } from "./inputs/FormAutocomplete";

export const FormProjectInfo = () => {
  return (
    <FormCard title="Informace o projektu">
      <Stack
        spacing={1}
        minWidth="100%"
      >
        <Grid
          container
          direction="row"
          spacing={2}
          columns={4}
        >
          <Grid
            item
            xs={3}
          >
            <FormAutocomplete
              label="Projekt"
              options={projects}
            />
          </Grid>
          <Grid
            item
            xs={1}
          >
            <FormControlLabel
              label="Fantom"
              labelPlacement="start"
              control={<Checkbox />}
              value="start"
              sx={{
                height: "100%",
              }}
            />
          </Grid>

          <Grid
            item
            xs={3}
          >
            <FormAutocomplete
              label="Přístroj"
              options={magnets}
            />
          </Grid>
          <Grid
            item
            xs={1}
          >
            <FormDatePicker
              label="Datum měření"
            />
          </Grid>
        </Grid>
      </Stack>
    </FormCard>
  );
}
