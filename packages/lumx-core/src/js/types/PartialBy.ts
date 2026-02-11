/**
 * Same as `Partial` but for one property only.
 *
 * @example PartialBy<Foo, 'bar'> => produces a type almost identical to `Foo` but with the `bar` property as optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Same as `Partial` but for all except some properties only.
 *
 * @example PartialExcept<Foo, 'bar'> => produces a type almost identical to `Foo` but with the `bar` property as it is on the original type.
 */
export type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
