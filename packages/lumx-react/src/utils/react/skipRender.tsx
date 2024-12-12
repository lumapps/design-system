import React from 'react';
import type { Comp } from '@lumx/react/utils/type';

/**
 * HOC component wrapping a component to skip render if predicate return falsy
 */
export const skipRender = <P, T>(predicate: (props: P) => any, Component: Comp<P, T>) => {
    const Wrapper = React.forwardRef<T, P>((props: any, ref) => {
        if (!predicate(props)) {
            // Can't render in SSR.
            return null;
        }
        return <Component ref={ref} {...props} />;
    });
    Wrapper.displayName = Component.displayName;
    return Wrapper;
};
