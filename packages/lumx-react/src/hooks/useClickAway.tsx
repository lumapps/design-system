import { RefObject, useEffect } from 'react';

import { Falsy } from '@lumx/react/utils/type';
import { setupClickAway } from '@lumx/core/js/utils/ClickAway';

export interface ClickAwayParameters {
    /**
     * A callback function to call when the user clicks away from the elements.
     */
    callback: EventListener | Falsy;
    /**
     * Elements considered within the click away context (clicking outside them will trigger the click away callback).
     */
    childrenRefs: RefObject<Array<RefObject<HTMLElement>>>;
}

/**
 * Listen to clicks away from the given elements and callback the passed in function.
 *
 * Warning: If you need to detect click away on nested React portals, please use the `ClickAwayProvider` component.
 */
export function useClickAway({ callback, childrenRefs }: ClickAwayParameters): void {
    useEffect(() => {
        const getElements = () => {
            const refs = childrenRefs.current;
            if (!refs) return [];
            return refs.map((ref) => ref?.current).filter(Boolean) as HTMLElement[];
        };
        return setupClickAway(getElements, callback);
    }, [callback, childrenRefs]);
}
