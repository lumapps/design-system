import React, { useEffect } from 'react';

type useInfiniteScrollType = (
    ref: React.RefObject<HTMLElement>,
    callback?: EventCallback,
    callbackOnMount?: boolean,
) => void;
type EventCallback = (evt?: Event) => void;

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param  ref               A reference to the element on which you want to listen scroll event.
 * @param  [callback]        A callback function to call when the bottom of the reference element is reached.
 * @param  [callbackOnMount] A callback function to call when the component is mounted.
 */
export const useInfiniteScroll: useInfiniteScrollType = (ref, callback, callbackOnMount = false) => {
    useEffect(() => {
        const { current } = ref;
        if (!callback || !current) {
            return undefined;
        }

        const isAtBottom = () => Boolean(current && current.scrollTop + current.clientHeight >= current.scrollHeight);

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
    }, [ref, callback]);

    useEffect(() => {
        if (callback && callbackOnMount) {
            callback();
        }
    }, [callback, callbackOnMount]);
};
