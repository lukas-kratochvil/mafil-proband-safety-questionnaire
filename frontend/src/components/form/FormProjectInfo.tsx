import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { defaultNS } from "../../i18n";
import { fetchDevices, fetchProjects } from "../../util/fetch";
import { ColoredInfoStripe, ColoredInfoStripeColors } from "../informative/ColoredInfoStripe";
import { FormCardContainer } from "./FormCardContainer";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { IPhantomFormCardProps } from "./types/types";

export const FormProjectInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
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
          <FormAutocomplete
            name="project"
            label={t("project")}
            options={projects}
            disabled={disableInputs}
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
            options={devices}
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
