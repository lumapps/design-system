import React, { useEffect } from 'react';

type useInfiniteScrollType = (
    ref: React.RefObject<HTMLElement>,
    callback?: EventCallback,
    callbackOnMount?: boolean,
) => void;
type EventCallback = (evt?: Event) => void;

// The error margin in px we want to have for triggering infinite scroll
const SCROLL_TRIGGER_MARGIN = 5;

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param  ref               A reference to the element on which you want to listen scroll event.
 * @param  [callback]        A callback function to call when the bottom of the reference element is reached.
 * @param  [callbackOnMount] A callback function to call when the component is mounted.
 */
export const useInfiniteScroll: useInfiniteScrollType = (
    ref,
    callback,
    callbackOnMount = false,
    scrollTriggerMargin = SCROLL_TRIGGER_MARGIN,
) => {
    useEffect(() => {
        const { current } = ref;
        if (!callback || !current) {
            return undefined;
        }

        const isAtBottom = () =>
            Boolean(
                current && current.scrollHeight - (current.scrollTop + current.clientHeight) <= scrollTriggerMargin,
            );

        const onScroll = (e?: Event): void => {
            if (isAtBottom()) {
                callback(e);
            }
        };

        if (isAtBottom()) {
            onScroll();
        }

        current.addEventListener('scroll', onScroll);
        current.addEventListener('resize', onScroll);
        return () => {
            current.removeEventListener('scroll', onScroll);
            current.removeEventListener('resize', onScroll);
        };
    }, [ref, callback, scrollTriggerMargin]);

    useEffect(() => {
        if (callback && callbackOnMount) {
            callback();
        }
    }, [callback, callbackOnMount]);
};
