/**
 * Converts an object to the union of its values.
 */
export type ObjectValuesUnion<T> = T[keyof T];

/**
 * Converts an array to the union of its values.
 */
export type ArrayToUnion<T extends ReadonlyArray<unknown>> = T[number];

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

/**
 * Construct a type with the properties of `T` except for those in subtype `K` of type `T`.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
