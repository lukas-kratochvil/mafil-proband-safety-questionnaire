import { VisualCorrection } from "@app/model/visitForm";

export type IOption = {
  value: number;
  localizationKey: string;
};

/**
 * Creates options from the provided enum entries.
 * @param entries enum entries obtained from Object.entries(T)
 * @param i18nPrefix enum key i18n prefix that will be prepended to 'translations.form' prefix
 * @return options array
 */
const createOptions = <T>(entries: [key: string, value: string | T][], i18nPrefix: string): IOption[] =>
  entries
    // This does the same filtering
    // .filter(([_key, value]) => typeof value === "number")
    .filter(([key, _value]) => Number.isNaN(+key))
    .map(
      ([key, value]): IOption => ({
        value: +value,
        localizationKey: `${i18nPrefix}.${key}`,
      })
    );

/**
 * Get option object by its value.
 * @param options options array
 * @param value value from enum specific to options array values
 * @return option or null if options do not contain provided value
 */
export const getOption = (options: IOption[], value: number): IOption | null =>
  // Autocomplete excepts option object or null
  options.find((option) => option.value === value) ?? null;

export const visualCorrectionOptions = createOptions<VisualCorrection>(
  Object.entries(VisualCorrection),
  "visualCorrection"
);
