import React from 'react';

let i = 0;

/**
 * Generate a unique id (for use in a11y or other id based DOM linking).
 *
 * (Tries to emulate React 18 useId hook, to remove once we upgrade React)
 */
export function useId() {
    return React.useMemo(() => {
        i += 1;
        return `:lumx${i}:`;
    }, []);
}
