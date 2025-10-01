import { RefObject, useEffect } from 'react';

import { Falsy } from '@lumx/react/utils/type';

import isEmpty from 'lodash/isEmpty';

const EVENT_TYPES = ['mousedown', 'touchstart'];

function isClickAway(target: HTMLElement, refs: Array<RefObject<HTMLElement>>): boolean {
    // The target element is not contained in any of the listed element references.
    return !refs.some((e) => e?.current?.contains(target));
}

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
        const { current: currentRefs } = childrenRefs;
        if (!callback || !currentRefs || isEmpty(currentRefs)) {
            return undefined;
        }
        const listener: EventListener = (evt) => {
            const target = evt.composedPath?.()[0] || evt.target;
            if (isClickAway(target as HTMLElement, currentRefs)) {
                callback(evt);
            }
        };

        EVENT_TYPES.forEach((evtType) => document.addEventListener(evtType, listener));
        return () => {
            EVENT_TYPES.forEach((evtType) => document.removeEventListener(evtType, listener));
        };
    }, [callback, childrenRefs]);
}
