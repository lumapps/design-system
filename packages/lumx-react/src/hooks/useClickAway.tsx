import React, { useEffect } from 'react';

type HandledEventType = MouseEvent | TouchEvent;
type EventCallback = (evt: HandledEventType) => void;

const EVENT_TYPES: string[] = ['mousedown', 'touchstart'];

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param  ref              A reference to an element we want to detect click away for.
 * @param  [callback]       A callback function to call when the user clicks away from the ref element.
 * @param  [additionalRefs] An array of additional references to elements we want to detect click away for.
 */
function useClickAway(
    ref: React.RefObject<HTMLElement>,
    callback: EventCallback,
    additionalRefs?: Array<React.RefObject<HTMLElement>>,
) {
    useEffect(() => {
        if (!callback) {
            return undefined;
        }

        const listener: EventCallback = (evt: HandledEventType) => {
            const refs = additionalRefs ? [ref, ...additionalRefs] : [ref];
            const isClickAway = !refs.some!(
                (r: React.RefObject<HTMLElement>) => r && r.current !== null && r.current.contains(evt.target as Node),
            );

            const elementsUndefined = refs.every((r: React.RefObject<HTMLElement>) => !r || !r.current);

            if (elementsUndefined || !isClickAway) {
                return;
            }

            callback(evt);
        };

        EVENT_TYPES.forEach((evtType: string) => document.addEventListener(evtType, listener as EventListener));

        return () => {
            EVENT_TYPES.forEach((evtType: string) => document.removeEventListener(evtType, listener as EventListener));
        };
    }, [callback]);
}

export { useClickAway };
