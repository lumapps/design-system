import React, { useEffect } from 'react';

type useInfiniteScrollType = (
    ref: React.RefObject<HTMLElement>,
    callback: EventCallback,
    callbackOnMount?: boolean,
) => void;
type EventCallback = (evt?: Event) => void;
// CONSTANTS

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param  ref              A reference to the element on which you want to listen scroll event.
 * @param  [callback]       A callback function to call when the bottom of the reference element is reached.
 */
const useInfiniteScroll: useInfiniteScrollType = (
    ref: React.RefObject<HTMLElement>,
    callback: EventCallback,
    callbackOnMount: boolean = false,
) => {
    const isAtBottom = (): boolean =>
        Boolean(ref.current && ref.current.scrollTop + ref.current.clientHeight >= ref.current.scrollHeight);

    const onScroll: EventListener = (e?: Event) => {
        if (isAtBottom() && callback) {
            callback(e);
        }
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('scroll', onScroll);
            ref.current.addEventListener('resize', onScroll);
        }
        return () => {
            if (ref.current) {
                ref.current.removeEventListener('scroll', onScroll);
                ref.current.removeEventListener('resize', onScroll);
            }
        };
    }, [ref, callback]);

    if (callbackOnMount) {
        useEffect(() => {
            callback();
        }, []);
    }
};

export { useInfiniteScroll };
