import type { ObjectValues } from "@app/util/utils";

export type IOption<T> = {
  value: T;
  localizationKey: string;
};

/**
 * Creates options from the provided enum entries.
 * @param entries enum entries obtained from Object.entries(T)
 * @param i18nPrefix enum key i18n prefix that will be prepended to 'translations.form' prefix
 * @return options array
 */
const createOptions = <T>(entries: [key: string, value: T][], i18nPrefix: string): IOption<T>[] =>
  entries.map(([key, value]) => ({
    value,
    localizationKey: `${i18nPrefix}.${key}`,
  }));

/**
 * Get option object by its value.
 * @param options options array
 * @param value value from enum specific to options array values
 * @return option or null if options do not contain provided value
 */
export const getOption = <T>(options: IOption<T>[], value: T): IOption<T> | null =>
  // Autocomplete expects option object or null
  options.find((option) => option.value === value) ?? null;

/**
 * Visual correction options
 */
const visualCorrectionOptionsObject = {
  yes: "yes",
  no: "no",
} as const;

export type VisualCorrection = ObjectValues<typeof visualCorrectionOptionsObject>;

export const visualCorrectionOptions = createOptions(
  Object.entries(visualCorrectionOptionsObject),
  "visualCorrection"
);
