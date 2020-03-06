import React, { useCallback, useEffect } from 'react';

type EventCallback = (evt?: Event) => void;

export type useInfiniteScrollType = (
    ref: React.RefObject<HTMLElement>,
    callback?: EventCallback,
    callbackOnMount?: boolean,
) => void;

const isAtBottom = (element?: HTMLElement | null) =>
    element && element.scrollTop + element.clientHeight >= element.scrollHeight;

/**
 * Listen to clicks away from a given element and callback the passed in function.
 *
 * @param  ref               A reference to the element on which you want to listen scroll event.
 * @param  callback          A callback function to call when the bottom of the reference element is reached.
 * @param  [callbackOnMount] Whether to call the callback on mount.
 */
export const useInfiniteScroll: useInfiniteScrollType = (ref, callback, callbackOnMount = false) => {
    const onScroll = useCallback(
        (e: Event) => {
            if (!isAtBottom(ref.current) || !callback) {
                return;
            }
            callback(e);
        },
        [ref, callback],
    );

    useEffect(() => {
        const { current } = ref;
        if (!current) {
            return undefined;
        }
        current.addEventListener('scroll', onScroll);
        current.addEventListener('resize', onScroll);
        return () => {
            current.removeEventListener('scroll', onScroll);
            current.removeEventListener('resize', onScroll);
        };
    }, [ref, onScroll]);

    useEffect(() => {
        if (callbackOnMount) {
            callback?.();
        }
    });
};
