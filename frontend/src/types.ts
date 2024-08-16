/**
 * Converts an object to the union of its values.
 */
export type ObjectValuesUnion<T> = T[keyof T];

/**
 * Converts an array of strings to the union of its strings.
 */
export type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];
