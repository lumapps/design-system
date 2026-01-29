import ReactDOM from 'react-dom';

import { MaybeElementOrRef } from '@lumx/react/utils/type';

import { unref } from '../../react/unref';
import { isReducedMotion } from '../isReducedMotion';

function setupViewTransitionName(elementRef: MaybeElementOrRef<HTMLElement>, name?: string) {
    let originalName: string | null = null;
    return {
        set() {
            const element = unref(elementRef);
            if (!element || !name) return;
            originalName = element.style.viewTransitionName;
            element.style.viewTransitionName = name;
        },
        unset() {
            const element = unref(elementRef);
            if (!element || originalName === null) return;
            element.style.viewTransitionName = originalName;
        },
    };
}

/**
 * Wrapper around the `document.startViewTransition` handling browser incompatibilities, react DOM flush and
 * user preference.
 *
 * @param changes                callback containing the changes to apply within the view transition.
 * @param setViewTransitionName  set the `viewTransitionName` style on a `source` & `target` to morph these elements.
 */
export async function startViewTransition({
    changes,
    viewTransitionName,
}: {
    changes: () => void;
    viewTransitionName?: {
        source: MaybeElementOrRef<HTMLElement>;
        target: MaybeElementOrRef<HTMLElement>;
        name: string;
    };
}) {
    const start = (document as any)?.startViewTransition?.bind(document);
    const prefersReducedMotion = isReducedMotion();
    const { flushSync } = ReactDOM as any;
    if (
        prefersReducedMotion ||
        !start ||
        !flushSync ||
        (viewTransitionName && (!viewTransitionName?.source || !viewTransitionName?.target))
    ) {
        // Skip, apply changes without a transition
        changes();
        return;
    }

    // Setup set/unset transition name on source & target
    const sourceTransitionName = setupViewTransitionName(viewTransitionName?.source, viewTransitionName?.name);
    const targetTransitionName = setupViewTransitionName(viewTransitionName?.target, viewTransitionName?.name);

    sourceTransitionName.set();

    // Start view transition, apply changes & flush to DOM
    await start(() => {
        sourceTransitionName.unset();

        flushSync(changes);

        targetTransitionName.set();
    }).updateCallbackDone;

    targetTransitionName.unset();
}
