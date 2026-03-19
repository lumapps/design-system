import { RefObject } from 'react';

import { setupRovingTabIndex } from '@lumx/core/js/utils/focusNavigation';

import { useEventCallback } from './useEventCallback';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface UseRovingTabIndexContainerOptions {
    /** Ref to the container element holding the focusable items. */
    containerRef: RefObject<HTMLElement>;
    /** CSS selector to identify focusable items within the container. */
    itemSelector: string;
    /** Callback invoked when an item receives focus via keyboard navigation. */
    onItemFocused?: (item: HTMLElement) => void;
    /**
     * Primary navigation axis — determines which arrow keys navigate.
     * Default: 'horizontal' (ArrowLeft/ArrowRight).
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * CSS selector matching disabled items within the container.
     * Disabled items are skipped during keyboard navigation.
     */
    itemDisabledSelector?: string;
}

export const useRovingTabIndexContainer = ({
    containerRef,
    itemSelector,
    onItemFocused: unstableOnItemFocused,
    direction,
    itemDisabledSelector,
}: UseRovingTabIndexContainerOptions): void => {
    const onItemFocused = useEventCallback(unstableOnItemFocused);

    useIsomorphicLayoutEffect(() => {
        const container = containerRef?.current;
        if (!container) {
            return undefined;
        }

        const abortController = new AbortController();
        setupRovingTabIndex(
            { container, itemSelector, direction, itemDisabledSelector, onItemFocused },
            abortController.signal,
        );
        return () => abortController.abort();
    }, [containerRef, itemSelector, direction, itemDisabledSelector, onItemFocused]);
};
