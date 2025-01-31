/** Transform a string literal into kebab case */
export type KebabCase<S> = S extends `${infer C}${infer T}`
    ? T extends Uncapitalize<T>
        ? `${Uncapitalize<C>}${KebabCase<T>}`
        : `${Uncapitalize<C>}-${KebabCase<T>}`
    : S;
