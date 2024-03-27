import { type IFormInputFieldContainerProps } from "./FormInputFieldContainer";

export type IFormDefaultInputProps = IFormInputFieldContainerProps & {
  disabled?: boolean;
};

export type IFormAsyncAutocompleteProps<T> = IFormDefaultInputProps & {
  options: T[] | undefined;
  isLoading: boolean;
};
