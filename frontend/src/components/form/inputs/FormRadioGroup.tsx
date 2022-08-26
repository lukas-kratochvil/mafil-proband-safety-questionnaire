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
}

export const FormRadioGroup = ({ name, disabled, radios }: IFormRadioGroupProps) => (
  <Controller
    name={name}
    defaultValue={null} // TODO: load through defaultValues in the useForm()
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
            control={
              <Radio
                required
                disabled={disabled}
              />
            }
          />
        ))}
      </RadioGroup>
    )}
  />
);
