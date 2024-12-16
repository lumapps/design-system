import type { ReactNode, ForwardedRef } from 'react';
import type { Comp } from '../type';

/**
 * React.forwardRef but re-typed to attach some custom metadata on our components.
 */
declare function forwardRef<P, T = HTMLElement>(render: (props: P, ref: ForwardedRef<T>) => ReactNode): Comp<P, T>;
