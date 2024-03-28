import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import type { ObjectValues } from "@app/util/utils";

export type IOption<T> = {
  value: T;
  localizationKey: TemplateStringsArray;
};

/**
 * Creates options from the provided enum entries.
 * @param optionsObject options object
 * @param i18nPrefix enum key i18n prefix that will be prepended to 'translations.form' prefix
 * @return options array
 */
const createOptions = <T>(optionsObject: Record<string, T>, i18nPrefix: string): IOption<T>[] =>
  Object.values(optionsObject).map((value) => ({
    value,
    localizationKey: convertStringToLocalizationKey(`options.${i18nPrefix}.${value}`),
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

export const visualCorrectionOptions = createOptions(visualCorrectionOptionsObject, "visualCorrection");
