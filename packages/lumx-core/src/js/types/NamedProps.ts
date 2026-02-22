/**
 * Strips index signature from a type, keeping only explicitly named properties.
 * Used to prevent `GenericProps`'s `[propName: string]: any` from contaminating
 * TypeScript inference of the option type `O`.
 */
export type NamedProps<T> = { [K in keyof T as string extends K ? never : K]: T[K] };
