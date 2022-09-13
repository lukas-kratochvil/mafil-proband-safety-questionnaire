import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

export interface IRadioProps {
  id: string;
  label: string;
  value: string;
}

interface IFormRadioGroupProps extends IFormDefaultInputProps {
  radios: IRadioProps[];
  defaultValue?: string;
}

export const FormRadioGroup = ({ name, disabled, radios, defaultValue }: IFormRadioGroupProps) => (
  <Controller
    name={name}
    // defaultValue cannot be loaded in the useForm(), we need to set the defaultValue manually here due to: https://github.com/react-hook-form/react-hook-form/discussions/8153#discussioncomment-2533857
    defaultValue={defaultValue ?? null}
    render={({ field: { value, onChange } }) => (
      <RadioGroup
        value={value}
        onChange={onChange}
        row
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
