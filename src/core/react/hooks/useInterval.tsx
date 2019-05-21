import { useEffect, useRef } from 'react';

import isFunction from 'lodash/isFunction';

/////////////////////////////

/**
 * Making setInterval Declarative with React Hooks.
 * Credits: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param {() => void} callback Function called by setInterval.
 * @param {number}     delay    Delay for setInterval.
 */
function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback: React.MutableRefObject<(() => void) | undefined> = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect((): void | (() => void) => {
        function tick(): void {
            if (isFunction(savedCallback.current)) {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            const id: NodeJS.Timeout = setInterval(tick, delay);

            return (): void => clearInterval(id);
        }
    }, [delay]);
}

export { useInterval };
