import { Grid, InputLabel, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "./ErrorMessage";

export type FormInputFieldContainerProps = {
  label: string;
  name: string;
  isOptional?: boolean;
};

export const FormInputFieldContainer = ({
  children,
  label,
  name,
  isOptional,
}: PropsWithChildren<FormInputFieldContainerProps>) => {
  const { t } = useTranslation("translation", { keyPrefix: "form.common" });

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <InputLabel htmlFor={name}>{label}</InputLabel>
        {isOptional && (
          <Typography
            fontSize="0.85rem"
            color={({ palette }) => palette.text.secondary}
          >
            {`(${t("optional")})`}
          </Typography>
        )}
      </Grid>
      {children}
      <ErrorMessage name={name} />
    </>
  );
};
