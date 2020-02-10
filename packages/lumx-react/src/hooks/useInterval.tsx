import { useEffect, useRef } from 'react';

import isFunction from 'lodash/isFunction';
import { Callback } from '../utils';

/////////////////////////////

/**
 * Making setInterval Declarative with React Hooks.
 * Credits: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback Function called by setInterval.
 * @param     delay    Delay for setInterval.
 */
function useInterval(callback: Callback, delay: number | null) {
    const savedCallback = useRef<Callback>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect((): Callback | void => {
        function tick() {
            if (isFunction(savedCallback.current)) {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);

            return () => clearInterval(id);
        }
    }, [delay]);
}

export { useInterval };
