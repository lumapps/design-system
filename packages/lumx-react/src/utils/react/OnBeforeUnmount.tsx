import { useLayoutEffect } from 'react';

/**
 * Helper component using useLayoutEffect to trigger a callback on before unmount.
 *
 * The callback must be wrapped in a React ref to avoid updating the `useLayoutEffect` before the un-mount
 */
export const OnBeforeUnmount = ({ callbackRef }: { callbackRef: React.RefObject<(() => void) | undefined> }) => {
    useLayoutEffect(
        () => {
            return () => {
                // On unmount
                // eslint-disable-next-line react-hooks/exhaustive-deps
                callbackRef.current?.();
            };
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return null;
};
