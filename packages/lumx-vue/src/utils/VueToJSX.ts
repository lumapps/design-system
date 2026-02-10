/**
 * Props interface for components wrapped with VueToJSX.
 * It omits JSX-specific props like `children` and `className` and adds Vue's `class`.
 *
 * @template Props - The base props type
 * @template OmitProps - Additional props to omit beyond the defaults (children, className, ref)
 */
export type VueToJSXProps<Props, OmitProps extends keyof Props = never> = Omit<
    Props,
    'children' | 'className' | 'ref' | 'onClick' | 'onChange' | OmitProps
> & {
    /** Class name forwarded to the root element of the component. */
    class?: string;
};

export const keysOf = <T>() => {
    return <K extends readonly (keyof T)[]>(
        ...keys: [keyof T] extends [K[number]]
            ? K
            : [Error: '❌ Missing keys in your list:', Exclude<keyof T, K[number]>]
    ): K => keys as any;
};
