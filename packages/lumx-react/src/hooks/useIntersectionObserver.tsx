import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * Convenient hook to create interaction observers.
 *
 * @param elementRefs Elements to observe.
 * @param options     IntersectionObserver options.
 * @return List of intersections
 */
export function useIntersectionObserver(
    elementRefs: Array<RefObject<HTMLElement>>,
    options?: IntersectionObserverInit,
) {
    const { root = null, rootMargin = '0px', threshold = [0], ...otherOptions } = options ?? {};
    const [intersections, setIntersections] = useState<IntersectionObserverEntry[]>([]);

    const observerRef = useRef(
        new IntersectionObserver(setIntersections, {
            root,
            rootMargin,
            threshold,
            ...otherOptions,
        }),
    );

    useEffect(() => {
        const { current: observer } = observerRef;
        observer.disconnect();
        if (!elementRefs) {
            return;
        }

        for (const elementRef of elementRefs) {
            if (elementRef.current) {
                observer.observe(elementRef.current);
            }
        }
        return () => observer.disconnect();
    }, [elementRefs]);

    return intersections;
}
