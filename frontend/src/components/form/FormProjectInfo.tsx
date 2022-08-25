import { Grid } from "@mui/material";
import { magnets, projects } from "../../data/form_data";
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
          label="Projekt"
          options={projects}
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
          defaultValue={new Date()}
        />
      </Grid>
    </Grid>
  </FormCard>
);
