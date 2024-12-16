import React, { type ElementType } from 'react';
import type { ComponentRef } from '@lumx/react/utils/type';

type ForwardRefPolymorphic = <E extends ElementType, P extends { as?: E }>(
    render: (props: P, ref: ComponentRef<E>) => React.ReactNode,
) => (props: P & React.ComponentProps<E> & { ref?: ComponentRef<E> }) => React.JSX.Element;

/** Same as `React.forwardRef` but inferring Ref type from the `as` prop. */
export const forwardRefPolymorphic = React.forwardRef as ForwardRefPolymorphic;
