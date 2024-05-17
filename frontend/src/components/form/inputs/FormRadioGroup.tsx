import { FormControlLabel, Radio, RadioGroup, type SxProps, type Theme } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FormDefaultInputProps } from "./input-props";

type RadioProps<T> = {
  id: string;
  label: string;
  value: T;
};

type FormRadioGroupProps<T> = FormDefaultInputProps & {
  radios: RadioProps<T>[];
  defaultValue: T | null;
  sx?: SxProps<Theme>;
};

export const FormRadioGroup = <T,>({ name, disabled, radios, defaultValue, sx }: FormRadioGroupProps<T>) => (
  <Controller
    name={name}
    // useForm() does not set default value for the radio group component, we need to set the defaultValue manually here due to: https://github.com/react-hook-form/react-hook-form/discussions/8153#discussioncomment-2533857
    defaultValue={defaultValue}
    render={({ field }) => (
      <RadioGroup
        {...field}
        row
        sx={sx}
      >
        {radios.map((radio) => (
          <FormControlLabel
            label={radio.label}
            value={radio.value}
            key={radio.id}
            control={<Radio disabled={disabled} />}
          />
        ))}
      </RadioGroup>
    )}
  />
);
