import { RefObject, useEffect } from 'react';

import { Falsy } from '@lumx/react/utils';

import isEmpty from 'lodash/isEmpty';

const EVENT_TYPES = ['mousedown', 'touchstart'];

function isClickAway(target: HTMLElement, refs: Array<RefObject<HTMLElement>>): boolean {
    // The target element is not contained in any of the listed element references.
    return !refs.some((e) => e && e.current && e.current.contains(target));
}

export interface ClickAwayParameters {
    /**
     * A callback function to call when the user clicks away from the elements.
     */
    callback: EventListener | Falsy;
    /**
     * Elements from which we want to detect the click away.
     */
    refs: Array<RefObject<HTMLElement>>;
}

/**
 * Listen to clicks away from the given elements and callback the passed in function.
 *
 * Warning: If you need to detect click away on nested React portals, please use the `ClickAwayProvider` component.
 */
export function useClickAway({ callback, refs }: ClickAwayParameters): void {
    useEffect(() => {
        if (!callback || !refs || isEmpty(refs)) {
            return undefined;
        }
        const listener: EventListener = (evt) => {
            if (isClickAway(evt.target as HTMLElement, refs)) {
                setTimeout(() => callback(evt));
            }
        };

        EVENT_TYPES.forEach((evtType) => document.addEventListener(evtType, listener));
        return () => {
            EVENT_TYPES.forEach((evtType) => document.removeEventListener(evtType, listener));
        };
    }, [callback, refs]);
}
