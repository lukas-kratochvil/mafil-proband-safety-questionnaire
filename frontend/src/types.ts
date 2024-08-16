/**
 * Converts an object to the union of its values.
 */
export type ObjectValuesUnion<T> = T[keyof T];

/**
 * Converts an array of strings to the union of its strings.
 */
export type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];

/**
 * Takes all properties from `T` and creates union with `U`.
 * All properties of `U` will be undefined.
 */
type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

/**
 * Takes either `T` or `U` and creates an union with the second type.
 * All properties of the second type will be undefined.
 */
export type Either<T, U> = Only<T, U> | Only<U, T>;
