import React, { useEffect, useReducer, useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * `useSyncExternalStore` for React 17 (same logic as the `use-sync-external-store` shim).
 */
export function useSyncExternalStoreFallback<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
): T {
    const value = getSnapshot();
    const [, forceRender] = useReducer((count: number) => count + 1, 0);
    const latestRef = useRef({ value, getSnapshot });

    useIsomorphicLayoutEffect(() => {
        latestRef.current = { value, getSnapshot };
        // The store can change between the render and the commit.
        if (!Object.is(value, getSnapshot())) forceRender();
    }, [value, getSnapshot]);

    useEffect(() => {
        const checkForUpdate = () => {
            const latest = latestRef.current;
            if (!Object.is(latest.value, latest.getSnapshot())) forceRender();
        };
        // The store can change between the commit and the subscription.
        checkForUpdate();
        return subscribe(checkForUpdate);
    }, [subscribe]);

    return value;
}

/**
 * React `useSyncExternalStore` (React 18+) or its fallback (React 17).
 *
 * Do not use the `use-sync-external-store/shim` package: rollup inlines its CommonJS code, which declares a local
 * `React` variable that breaks the CodeSandbox bundler (used by the demo site).
 */
export const useSyncExternalStore: typeof React.useSyncExternalStore =
    React.useSyncExternalStore ?? useSyncExternalStoreFallback;
