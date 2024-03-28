import { Grid } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ColoredInfoStripe } from "@app/components/informative/ColoredInfoStripe";
import { defaultNS } from "@app/i18n/i18n";
import type { FormPropType } from "@app/model/form";
import { fetchDevices, fetchProjects } from "@app/util/mafildb_API/calls";
import { FormAutocompleteDevices } from "../inputs/FormAutocompleteDevices";
import { FormAutocompleteProjects } from "../inputs/FormAutocompleteProjects";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormCardContainer } from "./FormCardContainer";
import type { PhantomFormCardProps } from "./form-card";

export const FormProjectInfo = ({ isPhantom, disableInputs }: PhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.projectInfo" });
  const { getValues, setValue } = useFormContext<FormPropType>();

  const [projects, devices] = useQueries({
    queries: [
      { queryKey: ["projects"], queryFn: fetchProjects, staleTime: Infinity, cacheTime: Infinity },
      { queryKey: ["devices"], queryFn: fetchDevices, staleTime: Infinity, cacheTime: Infinity },
    ],
  });

  // Setting selected project
  useEffect(() => {
    if (projects.data !== undefined) {
      const projectUuid = getValues("project.uuid");
      const selectedProject = projects.data.find((project) => project.uuid === projectUuid) ?? null;
      setValue("project", selectedProject, { shouldTouch: true });
    }
  }, [getValues, projects.data, setValue]);

  // Setting selected device
  useEffect(() => {
    if (devices.data !== undefined) {
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
          <FormAutocompleteProjects
            name="project"
            label={t("project")}
            options={projects.data}
            isLoading={projects.isLoading}
            disabled={disableInputs}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={8}
        >
          <FormAutocompleteDevices
            name="device"
            label={t("device")}
            options={devices.data}
            isLoading={devices.isLoading}
            disabled={disableInputs}
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
