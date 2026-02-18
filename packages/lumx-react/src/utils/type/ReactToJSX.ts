import { PropsToOverride } from '@lumx/core/js/types';

/**
 * Props interface for components wrapped with ReactToJSX.
 * It omits JSX-specific props like `children`
 *
 * @template Props - The base props type
 * @template OmitProps - Additional props to omit beyond the defaults (children, className, ref)
 */
export type ReactToJSX<Props, OmitProps extends keyof Props = never> = Omit<Props, PropsToOverride | OmitProps>;
