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
