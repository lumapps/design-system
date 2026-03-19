import React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Returns a stable callback that always calls the latest version of `fn`.
 * Useful to avoid re-running effects when a callback prop changes reference.
 *
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param fn A function to stabilize.
 * @return A stable function with the same signature.
 */
export function useEventCallback<T extends ((...args: any[]) => any) | undefined>(
    fn: T,
): T extends (...args: any[]) => any ? T : (...args: any[]) => undefined {
    const ref = React.useRef(fn);
    useIsomorphicLayoutEffect(() => {
        ref.current = fn;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback((...args: any[]) => ref.current?.(...args), []) as any;
}
