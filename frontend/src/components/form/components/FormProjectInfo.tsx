import { Grid } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ColoredInfoStripe, ColoredInfoStripeColors } from "@app/components/informative/ColoredInfoStripe";
import { defaultNS } from "@app/i18n";
import { FormPropType } from "@app/interfaces/form";
import { fetchDevices, fetchProjects } from "@app/util/fetch-mafildb";
import { FormAutocompleteDevices } from "../inputs/FormAutocompleteDevices";
import { FormAutocompleteProjects } from "../inputs/FormAutocompleteProjects";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { IPhantomFormCardProps } from "../interfaces/form-card";
import { FormCardContainer } from "./FormCardContainer";

export const FormProjectInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.projectInfo" });
  const { getValues, setValue } = useFormContext<FormPropType>();

  const [projects, devices] = useQueries({
    queries: [
      { queryKey: ["projects"], queryFn: fetchProjects },
      { queryKey: ["devices"], queryFn: fetchDevices },
    ],
  });

  // Setting project
  useEffect(() => {
    if (projects.data !== undefined) {
      const projectId = getValues("project.id");

      if (projectId !== "") {
        const selectedProject = projects.data.find((project) => project.id === projectId) || null;
        setValue("project", selectedProject, { shouldTouch: true });
      }
    }
  }, [getValues, projects.data, setValue]);

  // Setting device
  useEffect(() => {
    if (devices.data !== undefined) {
      const deviceId = getValues("device.id");

      if (deviceId !== "") {
        const selectedDevice = devices.data.find((device) => device.id === deviceId) || null;
        setValue("device", selectedDevice, { shouldTouch: true });
      }
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
              color={ColoredInfoStripeColors.BLUE}
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
            name="measurementDate"
            label={t("measurementDate")}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
