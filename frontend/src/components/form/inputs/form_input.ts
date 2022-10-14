import { IFormLabelFieldContainerProps } from "./FormLabelFieldContainer";

export interface IFormDefaultInputProps extends IFormLabelFieldContainerProps {
  name: string;
  disabled?: boolean;
}
