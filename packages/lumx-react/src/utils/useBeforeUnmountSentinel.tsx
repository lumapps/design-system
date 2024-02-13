import React, { useLayoutEffect } from 'react';

/** Small helper component using useLayoutEffect to trigger a callback on before unmount. */
const OnUnmount = ({ onBeforeUnmount }: { onBeforeUnmount: () => void }) => {
    useLayoutEffect(() => onBeforeUnmount, [onBeforeUnmount]);
    return null;
};

/**
 * Provides a sentinel to inject the React tree that triggers the callback on before unmount.
 */
export function useBeforeUnmountSentinel(onBeforeUnmount?: () => void) {
    return React.useMemo(() => {
        if (!onBeforeUnmount) return undefined;
        return <OnUnmount onBeforeUnmount={onBeforeUnmount} />;
    }, [onBeforeUnmount]);
}
