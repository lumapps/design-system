import { useEffect, useState } from 'react';

/**
 * Convenient hook to create interaction observers.
 *
 * @param elements Elements to observe.
 * @param options  IntersectionObserver options.
 * @return Map of intersections.
 */
export function useIntersectionObserver<T extends Element>(
    elements: Array<T | null | undefined>,
    options?: IntersectionObserverInit,
) {
    const [intersections, setIntersections] = useState<Map<T, IntersectionObserverEntry>>(() => new Map());

    useEffect(
        () => {
            if (elements.length < 1 || !elements.some(Boolean)) {
                return undefined;
            }

            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    intersections.set(entry.target as T, entry);
                }
                setIntersections(new Map(intersections));
            }, options);

            for (const element of elements) {
                observer.observe(element as T);
            }
            return () => observer.disconnect();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...elements],
    );

    return intersections;
}
