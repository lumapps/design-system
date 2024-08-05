import React from 'react';

import throttle from 'lodash/throttle';
import { RectSize } from '@lumx/react/utils/type';

/**
 * Observe element size (only works if it's size depends on the window size).
 *
 * (Not using ResizeObserver for better browser backward compat)
 *
 * @param elementRef Element to observe
 * @return the size and a manual update callback
 */
export function useSizeOnWindowResize(elementRef: React.RefObject<HTMLElement>): [RectSize | null, () => void] {
    const [size, setSize] = React.useState<null | RectSize>(null);
    const updateSize = React.useMemo(
        () =>
            throttle(() => {
                const newSize = elementRef.current?.getBoundingClientRect();
                if (newSize) setSize(newSize);
            }, 10),
        [elementRef],
    );
    React.useEffect(() => {
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [updateSize]);
    return [size, updateSize];
}
