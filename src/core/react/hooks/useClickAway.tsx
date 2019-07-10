import React, { useEffect } from 'react';

/////////////////////////////

type HandledEventType = MouseEvent | TouchEvent;
type EventCallback = (evt: HandledEventType) => void;

/////////////////////////////

const EVENT_TYPES: string[] = ['mousedown', 'touchstart'];

/////////////////////////////

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param {ref}      ref        A reference to an element we want to detect click away for.
 * @param {Function} [callback] A callback function to call when the user clicks away from the ref element.
 */
function useClickAway(ref: React.RefObject<HTMLElement>, callback: EventCallback): void {
    useEffect(() => {
        if (!callback) {
            return undefined;
        }

        const listener: EventCallback = (evt: HandledEventType): void => {
            if (!ref.current || ref.current.contains(evt.target as Node)) {
                return;
            }

            callback(evt);
        };

        EVENT_TYPES.forEach((evtType: string) => document.addEventListener(evtType, listener as EventListener));

        return (): void => {
            EVENT_TYPES.forEach((evtType: string) => document.removeEventListener(evtType, listener as EventListener));
        };
    }, [callback]);
}

export { useClickAway };
