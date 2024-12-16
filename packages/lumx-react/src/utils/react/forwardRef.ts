import React, { type ReactNode, type ForwardedRef } from 'react';
import type { Comp } from '../type';

type ForwardRef = <P, T = HTMLElement, A = unknown>(
    render: (props: P, ref: ForwardedRef<T>) => ReactNode,
) => Comp<P, T> & A;

/**
 * React.forwardRef but re-typed to attach some custom metadata on our components.
 */
export const forwardRef = React.forwardRef as ForwardRef;
