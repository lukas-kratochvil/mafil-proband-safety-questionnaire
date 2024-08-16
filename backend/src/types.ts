/**
 * Wrapper type used to circumvent ESM modules circular dependency issue caused by reflection metadata saving the type of the property.
 */
export type Wrapper<T> = T;

/**
 * Converts an array of strings to a union type.
 */
export type StringArrayToUnion<T extends ReadonlyArray<string>> = T[number];
