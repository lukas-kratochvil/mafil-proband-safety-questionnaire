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
    defaultValue={defaultValue ?? null} // TODO: load through defaultValues in the useForm()
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
