import { createListFocusNavigation } from './createListFocusNavigation';
import type { FocusNavigationController } from './types';

/**
 * Options for the roving tabindex setup.
 */
export interface RovingTabIndexOptions {
    /** The container element holding the focusable items. */
    container: HTMLElement;
    /** CSS selector to identify focusable items within the container. */
    itemSelector: string;
    /**
     * Primary navigation axis — determines which arrow keys navigate.
     * - `'horizontal'` (default): Left/Right navigate, Up/Down are no-ops.
     * - `'vertical'`: Up/Down navigate, Left/Right are no-ops.
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * CSS selector matching disabled items within the container.
     * Disabled items are skipped during keyboard navigation.
     */
    itemDisabledSelector?: string;
    /** Callback invoked when an item receives focus via keyboard navigation. */
    onItemFocused?: (item: HTMLElement) => void;
}

/**
 * Set up the roving tabindex pattern on a container element.
 *
 * Handles:
 * - Keyboard navigation (Arrow keys, Home, End) via a keydown listener on the container
 * - tabindex management on focus changes (`0` on active, `-1` on inactive)
 * - Calling `.focus()` on the newly active item
 *
 * The consumer is responsible for setting the initial tabindex values on items
 * (`tabindex="0"` on the active item, `tabindex="-1"` on the rest). On setup, the item
 * with `tabindex="0"` is silently adopted as the initial active item.
 *
 * The setup is torn down when the provided `signal` is aborted.
 *
 * @param options  Roving tabindex configuration.
 * @param signal   AbortSignal for teardown.
 * @returns The underlying {@link FocusNavigationController} for programmatic access.
 */
export function setupRovingTabIndex(options: RovingTabIndexOptions, signal: AbortSignal): FocusNavigationController {
    const { container, itemSelector, direction = 'horizontal', itemDisabledSelector, onItemFocused } = options;

    const nav = createListFocusNavigation(
        {
            type: 'list',
            container,
            itemSelector,
            direction,
            wrap: true,
            itemDisabledSelector,
            itemActiveSelector: `${itemSelector}[tabindex="0"]`,
        },
        {
            onActivate(item: HTMLElement) {
                item.setAttribute('tabindex', '0');
                item.focus();
                onItemFocused?.(item);
            },
            onDeactivate(item: HTMLElement) {
                item.setAttribute('tabindex', '-1');
            },
        },
        signal,
    );

    container.addEventListener(
        'keydown',
        (evt: KeyboardEvent) => {
            // Clear stale reference if the active item was removed from the DOM.
            if (nav.hasActiveItem && !nav.activeItem?.isConnected) {
                nav.clear();
            }

            // Sync: if nothing is active yet, pick up focus from the event target.
            if (!nav.hasActiveItem) {
                const target = evt.target as HTMLElement;
                if (target.matches(itemSelector) && container.contains(target)) {
                    nav.goToItem(target);
                }
            }

            let handled = false;

            switch (evt.key) {
                case 'ArrowRight':
                    handled = nav.goRight();
                    break;
                case 'ArrowLeft':
                    handled = nav.goLeft();
                    break;
                case 'ArrowDown':
                    handled = nav.goDown();
                    break;
                case 'ArrowUp':
                    handled = nav.goUp();
                    break;
                case 'Home':
                    handled = nav.goToFirst();
                    break;
                case 'End':
                    handled = nav.goToLast();
                    break;
                default:
                    break;
            }

            if (handled) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        },
        { signal },
    );

    return nav;
}
