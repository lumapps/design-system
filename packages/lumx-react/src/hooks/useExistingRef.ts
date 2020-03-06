import React, { useEffect, useRef } from 'react';

export function useExistingRef<T>(ref: React.RefObject<T> | undefined) {
    const clonedRef = useRef<T>(ref?.current as T);
    useEffect(() => {
        clonedRef.current = ref?.current as T;
    }, [ref]);
    return clonedRef;
}
