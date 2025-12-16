import React from 'react';
/**
 * Returns the value from the previous render.
 */
export function usePreviousValue<V>(value: V): V | undefined {
    const prevValueRef = React.useRef<V>();
    const prevValue = prevValueRef.current;
    React.useEffect(() => {
        prevValueRef.current = value;
    }, [value]);
    return prevValue;
}
