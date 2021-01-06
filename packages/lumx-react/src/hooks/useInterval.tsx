import { useEffect, useRef } from 'react';

import isFunction from 'lodash/isFunction';
import { Callback } from '../utils';

/**
 * Making setInterval Declarative with React Hooks.
 * Credits: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback Function called by setInterval.
 * @param     delay    Delay for setInterval.
 */
export function useInterval(callback: Callback, delay: number | null): void {
    const savedCallback = useRef<Callback>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (delay === null) return undefined;

        function tick() {
            if (isFunction(savedCallback.current)) {
                savedCallback.current();
            }
        }
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
