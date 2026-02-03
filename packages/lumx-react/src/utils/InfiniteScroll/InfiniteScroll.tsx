import React, { useEffect } from 'react';

type EventCallback = (evt?: Event) => void;

// The error margin in px we want to have for triggering infinite scroll
const CLASSNAME = 'lumx-infinite-scroll-anchor';

export interface InfiniteScrollProps {
    callback: EventCallback;
    options?: IntersectionObserverInit;
}

/**
 * Handles basic callback pattern by using intersection observers.
 *
 * @param  {Function} callback The callback to execute once the element is in the viewport or is intersecting
 *                             with its root element.
 * @param  {Object}   options  The set of options we want to set to the intersection observer.
 * @return {Element}  The Infinite scroll element.
 */
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ callback, options }) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries = []) => {
            const hasIntersection = entries.some((entry) => entry.isIntersecting);

            // Make sure at least one target element has intersected with the root element.
            if (!hasIntersection) {
                return;
            }

            callback();
        }, options);

        const currentRef = elementRef.current;
        if (elementRef && elementRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            observer.observe(elementRef.current);
        }

        return () => {
            if (currentRef) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                observer.unobserve(currentRef);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef.current, callback]);

    // In order to avoid issues when a zoom is added to the browser, we add a small height to the div so that
    // the intersection has a higher chance of working correctly.
    return <div ref={elementRef} aria-hidden="true" className={CLASSNAME} style={{ height: '4px' }} />;
};
