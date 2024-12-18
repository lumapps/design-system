import React, { type ReactNode, type ForwardedRef } from 'react';
import type { Comp } from '../type';

type ForwardRef = <P, T = HTMLElement>(render: (props: P, ref: ForwardedRef<T>) => ReactNode) => Comp<P, T>;

/**
 * React.forwardRef but re-typed to attach some custom metadata on our components.
 */
/*#__NO_SIDE_EFFECTS__*/
export const forwardRef = React.forwardRef as ForwardRef;
