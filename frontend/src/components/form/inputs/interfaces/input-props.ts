import { IFormInputFieldContainerProps } from "../FormInputFieldContainer";

export interface IFormDefaultInputProps extends IFormInputFieldContainerProps {
  disabled?: boolean;
}

export interface IFormAsyncAutocompleteProps<T> extends IFormDefaultInputProps {
  options: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
}
