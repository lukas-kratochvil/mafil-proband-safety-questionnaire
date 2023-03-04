import { Grid } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ColoredInfoStripe, ColoredInfoStripeColors } from "@app/components/informative/ColoredInfoStripe";
import { defaultNS } from "@app/i18n";
import { fetchDevices, fetchProjects } from "@app/util/fetch-mafildb";
import { FormAutocomplete } from "../inputs/FormAutocomplete";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { IPhantomFormCardProps } from "../interfaces/form-card";
import { FormCardContainer } from "./FormCardContainer";

export const FormProjectInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.projectInfo" });
  const results = useQueries({
    queries: [
      { queryKey: ["projects"], queryFn: fetchProjects },
      { queryKey: ["devices"], queryFn: fetchDevices },
    ],
  });

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
            options={results[0].data}
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
            options={results[1].data}
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
