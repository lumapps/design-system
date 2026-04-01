import { PropsToOverride } from '@lumx/core/js/types';
/**
 * Props interface for components wrapped with VueToJSX.
 * It omits JSX-specific props like `children` and `className` and adds Vue's `class`.
 *
 * @template Props - The base props type
 * @template OmitProps - Additional props to omit beyond the defaults (children, className, ref)
 */
export type VueToJSXProps<Props, OmitProps extends keyof Props = never> = Omit<
    Props,
    PropsToOverride | 'children' | 'className' | OmitProps
> & {
    /** Class name forwarded to the root element of the component. */
    class?: string;
};

/**
 * Hyphenated aria-* prop keys that must NOT be declared as Vue component props.
 * When declared, Vue normalizes them to camelCase (e.g. aria-haspopup → ariaHaspopup),
 * which breaks hyphenated key destructuring in core component templates.
 * By excluding them from props, they flow through `attrs` with their original hyphenated keys.
 */
export type HyphenatedAriaProps = 'aria-expanded' | 'aria-haspopup' | 'aria-label' | 'aria-pressed';

export const keysOf = <T>() => {
    return <K extends readonly (keyof T)[]>(
        ...keys: [keyof T] extends [K[number]]
            ? K
            : [Error: '❌ Missing keys in your list:', Exclude<keyof T, K[number]>]
    ) => {
        // Return an object with all props marked as optional (not required)
        // This ensures Vue's type system correctly infers props as optional
        return keys.reduce(
            (acc, key) => {
                acc[key as K[number]] = { required: false };
                return acc;
            },
            {} as Record<K[number], { required: false }>,
        );
    };
};
