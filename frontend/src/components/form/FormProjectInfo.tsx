import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { defaultNS } from "../../i18n";
import { fetchDevices, fetchProjects } from "../../util/fetch";
import { ColoredInfoStripe, ColoredInfoStripeColors } from "../informative/ColoredInfoStripe";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCardContainer } from "./FormCardContainer";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { IFantomFormInputsProps } from "./types/types";

export const FormProjectInfo = ({ isFantom, disableInputs }: IFantomFormInputsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.projectInfo" });
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
    <FormCardContainer title={t("title")}>
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
            label={t("project")}
            options={projects}
            disabled={disableInputs}
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
            label={t("device")}
            options={devices}
            disabled={disableInputs}
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
            label={t("measurementDate")}
            disabled={disableInputs}
          />
          <ErrorFeedback name="measurementDate" />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
