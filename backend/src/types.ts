/**
 * Wrapper type used to circumvent ESM modules circular dependency issue caused by reflection metadata saving the type of the property.
 */
export type Wrapper<T> = T;

/**
 * Converts an array to the union of its values.
 */
export type ArrayToUnion<T extends ReadonlyArray<unknown>> = T[number];

/**
 * Construct a type with the properties of `T` except for those in subtype `K` of type `T`.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
