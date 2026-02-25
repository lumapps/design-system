/**
 * Shared types and logic for ClickAway detection.
 *
 * ClickAway detects clicks outside a set of elements and triggers a callback.
 * The core logic (event listening + target checking) is framework-agnostic.
 * Framework-specific wrappers (React hook, Vue composable) and context providers
 * (React context, Vue provide/inject) are implemented in each framework package.
 */

import type { Falsy } from '@lumx/core/js/types';

/** Event types that trigger click away detection. */
export const CLICK_AWAY_EVENT_TYPES = ['mousedown', 'touchstart'] as const;

/** Callback triggered when a click away is detected. */
export type ClickAwayCallback = EventListener | Falsy;

/**
 * Check if the click event targets are outside all the given elements.
 *
 * @param targets - The event target elements (from `event.target` and `event.composedPath()`).
 * @param elements - The elements considered "inside" the click away context.
 * @returns `true` if the click is outside all elements (i.e. a click away).
 */
export function isClickAway(targets: HTMLElement[], elements: HTMLElement[]): boolean {
    return !elements.some((element) => targets.some((target) => element?.contains(target)));
}

/**
 * Imperative setup for click away detection.
 * Adds mousedown/touchstart listeners on `document` and calls the callback when a click
 * occurs outside the elements returned by `getElements`.
 *
 * Note: when `getElements` returns an empty array, any click is considered a click away.
 * Callers should guard against calling `setupClickAway` when no refs are registered.
 *
 * @param getElements - Getter returning the current list of elements considered "inside".
 * @param callback - Callback to invoke on click away.
 * @returns A teardown function that removes the event listeners.
 */
export function setupClickAway(
    getElements: () => HTMLElement[],
    callback: ClickAwayCallback,
): (() => void) | undefined {
    if (!callback) {
        return undefined;
    }

    const listener: EventListener = (evt) => {
        const targets = [evt.composedPath?.()[0], evt.target] as HTMLElement[];
        const elements = getElements();
        if (isClickAway(targets, elements)) {
            callback(evt);
        }
    };

    CLICK_AWAY_EVENT_TYPES.forEach((evtType) => document.addEventListener(evtType, listener));
    return () => {
        CLICK_AWAY_EVENT_TYPES.forEach((evtType) => document.removeEventListener(evtType, listener));
    };
}
