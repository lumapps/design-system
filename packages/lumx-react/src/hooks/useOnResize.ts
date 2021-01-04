import { Callback, Falsy } from '@lumx/react/utils';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { WINDOW } from '@lumx/react/constants';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

const ResizeObserver: typeof Polyfill = (WINDOW as any)?.ResizeObserver || Polyfill;

export function useOnResize(element: HTMLElement | Falsy, update: RefObject<Callback>): void {
    const observerRef = useRef(null) as MutableRefObject<Polyfill | null>;
    const previousSize = useRef<{ width: number; height: number }>();

    useEffect(() => {
        if (!element || !update) {
            return undefined;
        }

        previousSize.current = undefined;
        const observer =
            observerRef.current ||
            new ResizeObserver(([entry]) => {
                if (
                    previousSize.current?.width === entry.contentRect.width &&
                    previousSize.current?.height === entry.contentRect.height
                ) {
                    return;
                }
                update.current?.();
                previousSize.current = entry.contentRect;
            });
        if (!observerRef.current) observerRef.current = observer;

        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [element, update]);
}
