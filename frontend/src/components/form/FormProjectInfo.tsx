import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchDevices, fetchProjects } from "../../util/fetch";
import { ColoredInfoStripe, ColoredInfoStripeColors } from "../informative/ColoredInfoStripe";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCard } from "./FormCard";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";

interface IFormProjectInfoProps {
  isFantom?: boolean;
}

export const FormProjectInfo = ({ isFantom }: IFormProjectInfoProps) => {
  const [projects, setProjects] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const projectsPromise = fetchProjects();
      const devicesPromise = fetchDevices();
      setProjects(await projectsPromise);
      setDevices(await devicesPromise);
    };

    fetch();
  }, []);

  return (
    <FormCard title="Informace o projektu">
      <Grid
        container
        direction="row"
        spacing="1rem"
        columns={12}
      >
        {isFantom && (
          <Grid
            item
            xs={12}
          >
            <ColoredInfoStripe
              text="Fantom"
              color={ColoredInfoStripeColors.BLUE}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
        >
          <FormAutocomplete
            name="project"
            label="Projekt"
            options={projects}
          />
          <ErrorFeedback name="project" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={8}
        >
          <FormAutocomplete
            name="device"
            label="Přístroj"
            options={devices}
          />
          <ErrorFeedback name="device" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormDatePicker
            name="measurementDate"
            label="Datum měření"
          />
          <ErrorFeedback name="measurementDate" />
        </Grid>
      </Grid>
    </FormCard>
  );
};
