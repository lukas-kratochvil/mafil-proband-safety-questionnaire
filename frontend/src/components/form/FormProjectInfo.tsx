import { Grid } from "@mui/material";
import { magnetDevices, projects } from "../../data/form_data";
import { ColoredInfoStripe } from "../informative/ColoredInfoStripe";
import { FormCard } from "./FormCard";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";

interface IFormProjectInfoProps {
  isFantom?: boolean;
}

export const FormProjectInfo = ({ isFantom }: IFormProjectInfoProps) => (
  <FormCard title="Informace o projektu">
    <Grid
      container
      direction="row"
      spacing={2}
      columns={4}
    >
      {isFantom && (
        <Grid
          item
          xs={4}
        >
          <ColoredInfoStripe
            text="Fantom"
            color="info"
          />
        </Grid>
      )}
      <Grid
        item
        xs={4}
      >
        <FormAutocomplete
          name="project"
          label="Projekt"
          options={projects}
        />
      </Grid>
      <Grid
        item
        xs={3}
      >
        <FormAutocomplete
          name="magnetDevice"
          label="Přístroj"
          options={magnetDevices}
        />
      </Grid>
      <Grid
        item
        xs={1}
      >
        <FormDatePicker
          name="measurementDate"
          label="Datum měření"
        />
      </Grid>
    </Grid>
  </FormCard>
);
