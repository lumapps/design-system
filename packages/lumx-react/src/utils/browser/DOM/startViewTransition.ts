import ReactDOM from 'react-dom';

import { MaybeElementOrRef } from '@lumx/react/utils/type';

import { unref } from '../../react/unref';
import { isReducedMotion } from '../isReducedMotion';

interface TransitionGroup {
    /** Element that should be transitioned from */
    old: MaybeElementOrRef<Element>;
    /** Element that should be transitioned to */
    new: MaybeElementOrRef<Element>;
    /** viewTransitionName */
    name: string;
}

function setupViewTransitionName(groups: TransitionGroup[], type: 'old' | 'new') {
    const resets: Array<() => void> = [];
    for (const group of groups) {
        const element = unref(group[type]);
        if (element instanceof HTMLElement) {
            const originalName = element.style.viewTransitionName;
            resets.push(() => {
                element.style.viewTransitionName = originalName;
            });
            element.style.viewTransitionName = group.name;
        }
    }
    return () => {
        for (const reset of resets) {
            reset();
        }
    };
}

/**
 * Wrapper around the `document.startViewTransition` handling browser incompatibilities, react DOM flush and
 * user preference.
 *
 * @param updateCallback      callback containing the changes to apply within the view transition.
 * @param groups              setup groups of old and new element pair to transition between.
 */
export async function startViewTransition(
    updateCallback: () => void,
    {
        groups = [],
    }: {
        groups?: TransitionGroup[];
    } = {},
) {
    const start = (document as any)?.startViewTransition?.bind(document);
    const prefersReducedMotion = isReducedMotion();
    const { flushSync } = ReactDOM as any;
    if (prefersReducedMotion || !start || !flushSync) {
        // Skip, apply changes without a transition
        updateCallback();
        return;
    }

    // Setup view transition name on old elements
    const resetOldElement = setupViewTransitionName(groups, 'old');

    let resetNewElements: (() => void) | undefined;

    // Start view transition, apply changes & flush to DOM
    await start(() => {
        resetOldElement();

        flushSync(updateCallback);

        // Setup view transition name on new elements
        resetNewElements = setupViewTransitionName(groups, 'new');
    }).updateCallbackDone;

    resetNewElements?.();
}
