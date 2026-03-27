import { type Ref, watchEffect } from 'vue';

import { setupRovingTabIndex } from '@lumx/core/js/utils/focusNavigation';

export interface UseRovingTabIndexContainerOptions {
    /** Ref to the container element holding the focusable items. */
    containerRef: Ref<HTMLElement | null | undefined>;
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

/**
 * Vue composable equivalent of React's useRovingTabIndexContainer.
 * Sets up roving tab index keyboard navigation on a container element.
 * Automatically tears down when the container is removed or the composable is unmounted.
 */
export function useRovingTabIndexContainer({
    containerRef,
    itemSelector,
    onItemFocused,
    direction,
    itemDisabledSelector,
}: UseRovingTabIndexContainerOptions): void {
    watchEffect((onCleanup) => {
        const container = containerRef.value;
        if (!container) return;

        const abortController = new AbortController();
        setupRovingTabIndex(
            { container, itemSelector, direction, itemDisabledSelector, onItemFocused },
            abortController.signal,
        );

        onCleanup(() => abortController.abort());
    });
}
