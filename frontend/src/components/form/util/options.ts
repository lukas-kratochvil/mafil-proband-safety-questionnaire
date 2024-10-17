import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import type { ObjectValuesUnion } from "@app/types";

export type AutocompleteOption<T> = {
  value: T;
  localizationKey: TemplateStringsArray;
};

/**
 * Creates options from values of the provided object.
 * @param optionsObject options object
 * @param i18nPrefix i18n prefix that will be prepended to 'translations.form' prefix
 * @return options array
 */
const createAutocompleteOptions = <T>(optionsObject: Record<string, T>, i18nPrefix: string): AutocompleteOption<T>[] =>
  Object.values(optionsObject).map(
    (value): AutocompleteOption<T> => ({
      value,
      localizationKey: convertStringToLocalizationKey(`options.${i18nPrefix}.${value}`),
    })
  );

/**
 * Get option object by its value.
 * @param options options array
 * @param value one of the option's values
 * @return option or null if options do not contain provided value
 */
export const getAutocompleteOption = <T>(options: AutocompleteOption<T>[], value: T): AutocompleteOption<T> | null =>
  // Autocomplete expects option object or null
  options.find((option) => option.value === value) ?? null;

/**
 * Visual correction options
 */
const visualCorrectionOptionsObject = {
  yes: "yes",
  no: "no",
} as const;

export type VisualCorrection = ObjectValuesUnion<typeof visualCorrectionOptionsObject>;

export const visualCorrectionOptions = createAutocompleteOptions(visualCorrectionOptionsObject, "visualCorrection");
