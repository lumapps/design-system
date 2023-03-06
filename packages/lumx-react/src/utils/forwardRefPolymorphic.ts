import React, { ElementType } from 'react';
import { ComponentRef } from '@lumx/react/utils/type';

/** Same as `React.forwardRef` but inferring Ref type from the `as` prop. */
export function forwardRefPolymorphic<E extends ElementType, P extends { as?: E }>(
    render: (props: P, ref: ComponentRef<E>) => React.ReactElement | null,
) {
    return React.forwardRef(render as any) as (props: P & { ref?: ComponentRef<E> }) => React.ReactElement | null;
}
