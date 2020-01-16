import { useEffect, useRef, useState } from 'react';

type returnType = [(HTMLElement) => void, IntersectionObserverEntry[]];
type functionType = (IntersectionObserverInit) => returnType;

/**
 * Convenient hook to create interaction observers.
 * @return Tuple of the sentinel ref and the list of intersections
 */
export const useIntersectionObserver: functionType = ({
    root = null,
    rootMargin = '0px',
    threshold = [0],
    ...options
}) => {
    const [intersections, setIntersections] = useState<IntersectionObserverEntry[]>([]);
    const [element, setElement] = useState<HTMLElement>();

    const observer = useRef(
        new IntersectionObserver(setIntersections, {
            root,
            rootMargin,
            threshold,
            ...options,
        }),
    );

    useEffect(() => {
        const { current: currentObserver } = observer;
        currentObserver.disconnect();

        if (element) {
            currentObserver.observe(element);
            return () => currentObserver.disconnect();
        }
        return;
    }, [element]);

    return [setElement, intersections];
};
