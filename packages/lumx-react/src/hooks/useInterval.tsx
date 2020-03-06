import { useEffect, useRef } from 'react';

import isFunction from 'lodash/isFunction';

/**
 * Making setInterval Declarative with React Hooks.
 * Credits: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback Function called by setInterval.
 * @param delay    Delay for setInterval.
 */
export function useInterval(callback: VoidFunction, delay: number | null) {
    const savedVoidFunction = useRef<VoidFunction>();

    useEffect(() => {
        savedVoidFunction.current = callback;
    });

    useEffect(() => {
        if (delay === null) {
            return undefined;
        }
        function tick() {
            if (isFunction(savedVoidFunction.current)) {
                savedVoidFunction.current();
            }
        }
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
