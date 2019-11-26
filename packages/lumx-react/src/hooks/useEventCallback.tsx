import React from 'react';

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param fn A function to run
 * @return A React callbacl
 */
// tslint:disable-next-line: typedef
export default function useEventCallback(fn) {
    const ref = React.useRef(fn);
    useEnhancedEffect(() => {
        ref.current = fn;
    });
    // tslint:disable-next-line: no-any
    return React.useCallback((event: any) => ref.current(event), []);
}
