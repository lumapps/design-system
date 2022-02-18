import React from 'react';

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param fn A function to run
 * @return A React callback
 */
export default function useEventCallback(fn: (...args: any[]) => any): (event: any) => any {
    const ref = React.useRef(fn);
    useEnhancedEffect(() => {
        ref.current = fn;
    });
    return React.useCallback((event: any) => ref.current(event), []);
}
