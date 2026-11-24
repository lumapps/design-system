import type { PropType } from 'vue';

import { PropsToOverride } from '@lumx/core/js/types';

/**
 * Mirrors the value types accepted by Vue's class binding (and `normalizeClass`):
 * a string, an object mapping class names to booleans, an array of any of the above, or falsy.
 */
export type ClassValue = string | number | boolean | null | undefined | ClassValue[] | Record<string, unknown>;

/**
 * Props interface for components wrapped with VueToJSX.
 * It omits JSX-specific props like `children` and `className` and adds Vue's `class`.
 *
 * @template Props - The base props type
 * @template OmitProps - Additional props to omit beyond the defaults (children, className, ref)
 */
// A key-remapped mapped type in place of `Omit`: `Omit` drops the known keys of a type with an index signature.
export type VueToJSXProps<Props, OmitProps extends keyof Props = never> = {
    [K in keyof Props as K extends PropsToOverride | 'children' | 'className' | OmitProps ? never : K]: Props[K];
} & {
    /** Class name forwarded to the root element of the component. */
    class?: ClassValue;
};

/**
 * Hyphenated aria-* prop keys that must NOT be declared as Vue component props.
 * When declared, Vue normalizes them to camelCase (e.g. aria-haspopup → ariaHaspopup),
 * which breaks hyphenated key destructuring in core component templates.
 * By excluding them from props, they flow through `attrs` with their original hyphenated keys.
 */
export type HyphenatedAriaProps =
    | 'aria-current'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-pressed';

/**
 * Build a Vue component `name` from its component name, prefixed with `Lumx`.
 *
 * The prefix avoids collisions with native HTML/SVG tags (e.g. `button`, `dialog`, `link`, `table`,
 * `text`) and namespaces LumX components in Vue devtools / `<KeepAlive>`.
 */
export const getName = (componentName: string) => `Lumx${componentName}` as const;

/**
 * Keys of `T` whose value accepts a boolean.
 * The `[unknown] extends [T[K]]` guard excludes props typed `any` or `unknown`.
 * The `number extends NonNullable<T[K]>` guard excludes content unions (`JSXElement`, i.e.
 * `React.ReactNode`) and `ClassValue`: both admit a bare `number` and happen to list `boolean`
 * as one of their members too, but neither is a boolean prop. No boolean prop in this codebase
 * also accepts a bare `number`, so this guard never excludes a real one.
 */
type BooleanKey<T> = {
    [K in keyof T]-?: [unknown] extends [T[K]]
        ? never
        : number extends NonNullable<T[K]>
          ? never
          : boolean extends NonNullable<T[K]>
            ? K
            : never;
}[keyof T];

/** Vue constructors usable in a prop `type` list. */
type PropConstructor =
    | BooleanConstructor
    | StringConstructor
    | NumberConstructor
    | ObjectConstructor
    | ArrayConstructor
    | FunctionConstructor;

/** `[name, Boolean, ...constructors]` entry of a `keysOf` list, for a boolean prop. */
type BooleanEntry<T> = readonly [BooleanKey<T>, BooleanConstructor, ...PropConstructor[]];

/** One entry of a `keysOf` list: a prop name, or a `BooleanEntry`. */
type KeyEntry<T> = keyof T | BooleanEntry<T>;

/** First member of a tuple entry, or the entry itself when it is a plain name. */
type NameOf<E> = E extends readonly [infer N, ...unknown[]] ? N : E;

/** Boolean keys given as a plain name in place of a `BooleanEntry`. */
type PlainBooleanKey<T, E> = Extract<Exclude<E, readonly unknown[]>, BooleanKey<T>>;

type KeysOfResult<T, E> = {
    [N in NameOf<E> & keyof T]: N extends NameOf<Extract<E, readonly unknown[]>>
        ? { type: PropType<T[N]>; default: undefined }
        : { required: false };
};

const isBooleanEntry = <T>(entry: KeyEntry<T>): entry is BooleanEntry<T> => Array.isArray(entry);

/**
 * Build the Vue `props` object of a component. The type refuses a list that misses a key of `T`.
 *
 * A boolean prop must be a `[name, Boolean]` entry, so that a bare template attribute
 * (`<Button full-width />`) casts to `true` instead of the empty string. Add the other accepted
 * constructors after `Boolean` (`['isChecked', Boolean, String]`): `Boolean` must come first for the cast.
 * `default: undefined` keeps the core `DEFAULT_PROPS` in charge of the value when the prop is
 * absent (Vue otherwise casts a missing boolean prop to `false`).
 */
export const keysOf = <T>() => {
    return <K extends readonly KeyEntry<T>[]>(
        ...keys: [keyof T] extends [NameOf<K[number]>]
            ? [PlainBooleanKey<T, K[number]>] extends [never]
                ? K
                : [Error: '❌ Declare boolean keys as [key, Boolean]:', PlainBooleanKey<T, K[number]>]
            : [Error: '❌ Missing keys in your list:', Exclude<keyof T, NameOf<K[number]>>]
    ) => {
        const props: Record<PropertyKey, object> = {};
        for (const entry of keys as readonly KeyEntry<T>[]) {
            if (isBooleanEntry(entry)) {
                const [name, ...constructors] = entry;
                props[name] = { type: constructors.length > 1 ? constructors : Boolean, default: undefined };
            } else {
                // Mark the prop optional so that Vue's type system infers it as optional.
                props[entry] = { required: false };
            }
        }
        return props as KeysOfResult<T, K[number]>;
    };
};

/**
 * Derive the typed Vue emits map from a runtime `emitSchema` object.
 *
 * @example
 * export const emitSchema = {
 *     change: (_newValue?: unknown) => true,
 *     search: (_text: string) => true,
 * };
 * export type MyEmits<O> = EmitsOf<typeof emitSchema>
 */
export type EmitsOf<S> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof S]: S[K] extends (...args: infer A) => any ? (...args: A) => void : never;
};
