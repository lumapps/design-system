import { RefObject, useEffect } from 'react';

import { Falsy } from '@lumx/react/utils';

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
     * Elements from which we want to detect the click away.
     */
    refs: RefObject<Array<RefObject<HTMLElement>>>;
}

/**
 * Listen to clicks away from the given elements and callback the passed in function.
 *
 * Warning: If you need to detect click away on nested React portals, please use the `ClickAwayProvider` component.
 */
export function useClickAway({ callback, refs }: ClickAwayParameters): void {
    useEffect(() => {
        const { current: currentRefs } = refs;
        if (!callback || !currentRefs || isEmpty(currentRefs)) {
            return undefined;
        }
        const listener: EventListener = (evt) => {
            if (isClickAway(evt.target as HTMLElement, currentRefs)) {
                callback(evt);
            }
        };

        EVENT_TYPES.forEach((evtType) => document.addEventListener(evtType, listener));
        return () => {
            EVENT_TYPES.forEach((evtType) => document.removeEventListener(evtType, listener));
        };
    }, [callback, refs]);
}
