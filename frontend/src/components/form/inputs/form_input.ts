import { IFormLabelFieldProps } from "./FormLabelField";

export interface IFormDefaultInputProps extends IFormLabelFieldProps {
  name: string;
  disabled?: boolean;
}
