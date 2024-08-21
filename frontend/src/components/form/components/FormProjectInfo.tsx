import { Grid } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ColoredInfoStripe } from "@app/components/informative/ColoredInfoStripe";
import type { FormPropType } from "@app/model/form";
import { fetchDevices, fetchProjects } from "@app/util/mafildb_API/calls";
import { FormAutocomplete } from "../inputs/FormAutocomplete";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormCardContainer } from "./FormCardContainer";
import type { PhantomFormCardProps } from "./form-card";

export const FormProjectInfo = ({ isPhantom, disableInputs }: PhantomFormCardProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "form.projectInfo" });
  const { getValues, setValue } = useFormContext<FormPropType>();

  const [projects, devices] = useQueries({
    queries: [
      { queryKey: ["projects"], queryFn: fetchProjects, staleTime: Infinity, gcTime: Infinity },
      { queryKey: ["devices"], queryFn: fetchDevices, staleTime: Infinity, gcTime: Infinity },
    ],
  });

  // Setting selected project
  useEffect(() => {
    if (projects.data) {
      const projectUuid = getValues("project.uuid");
      const selectedProject = projects.data.find((project) => project.uuid === projectUuid) ?? null;
      setValue("project", selectedProject, { shouldTouch: true });
    }
  }, [getValues, projects.data, setValue]);

  // Setting selected device
  useEffect(() => {
    if (devices.data) {
      const deviceId = getValues("device.id");
      const selectedDevice = devices.data.find((device) => device.id === deviceId) ?? null;
      setValue("device", selectedDevice, { shouldTouch: true });
    }
  }, [devices.data, getValues, setValue]);

  return (
    <FormCardContainer title={t("title")}>
      <Grid
        container
        direction="row"
        spacing="1rem"
        columns={12}
      >
        {isPhantom && (
          <Grid
            item
            xs={12}
          >
            <ColoredInfoStripe
              textLocalizationKey="form.projectInfo.phantomInfoStripe"
              color="blue"
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
        >
          <FormAutocomplete
            name="project"
            label={t("project")}
            options={projects.data}
            isLoading={projects.isLoading}
            disabled={disableInputs}
            getOptionLabel={(project) => `${project.acronym.trim()} - ${project.name.trim()}`}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={8}
        >
          <FormAutocomplete
            name="device"
            label={t("device")}
            options={devices.data}
            isLoading={devices.isLoading}
            disabled={disableInputs}
            getOptionLabel={(device) => device.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormDatePicker
            name="measuredAt"
            label={t("measuredAt")}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
