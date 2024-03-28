import type { FormInputFieldContainerProps } from "./FormInputFieldContainer";

export type FormDefaultInputProps = FormInputFieldContainerProps & {
  disabled?: boolean;
};

export type FormAsyncAutocompleteProps<T> = FormDefaultInputProps & {
  options: T[] | undefined;
  isLoading: boolean;
};
