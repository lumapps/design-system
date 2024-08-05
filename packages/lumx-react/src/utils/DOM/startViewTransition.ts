import ReactDOM from 'react-dom';

import { MaybeElementOrRef } from '@lumx/react/utils/type';

import { unref } from '../react/unref';
import { getPrefersReducedMotion } from '../browser/getPrefersReducedMotion';

function setTransitionViewName(elementRef: MaybeElementOrRef<HTMLElement>, name: string | null | undefined) {
    const element = unref(elementRef) as any;
    if (element) element.style.viewTransitionName = name;
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
    viewTransitionName: {
        source: MaybeElementOrRef<HTMLElement>;
        target: MaybeElementOrRef<HTMLElement>;
        name: string;
    };
}) {
    const start = (document as any)?.startViewTransition?.bind(document);
    const prefersReducedMotion = getPrefersReducedMotion();
    const { flushSync } = ReactDOM as any;
    if (prefersReducedMotion || !start || !flushSync || !viewTransitionName?.source || !viewTransitionName?.target) {
        // Skip, apply changes without a transition
        changes();
        return;
    }

    // Set transition name on source element
    setTransitionViewName(viewTransitionName.source, viewTransitionName.name);

    // Start view transition, apply changes & flush to DOM
    await start(() => {
        // Un-set transition name on source element
        setTransitionViewName(viewTransitionName.source, null);

        flushSync(changes);

        // Set transition name on target element
        setTransitionViewName(viewTransitionName.target, viewTransitionName.name);
    }).updateCallbackDone;

    // Un-set transition name on target element
    setTransitionViewName(viewTransitionName.target, null);
}
