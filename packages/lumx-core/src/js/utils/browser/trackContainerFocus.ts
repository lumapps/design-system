/**
 * Track whether the container currently has focus.
 *
 * We can't rely on `document.activeElement` inside MutationObserver callbacks because
 * the browser moves focus to `<body>` before they fire. focusout with `relatedTarget === null`
 * (element removed from DOM) keeps the flag true so the observer can move focus to a fallback.
 */
export function trackContainerFocus(container: HTMLElement, signal: AbortSignal) {
    let hasFocus = container.contains(document.activeElement);
    container.addEventListener(
        'focusin',
        () => {
            hasFocus = true;
        },
        { signal },
    );
    container.addEventListener(
        'focusout',
        (evt: FocusEvent) => {
            const newTarget = evt.relatedTarget as Node | null;
            if (newTarget && !container.contains(newTarget)) {
                hasFocus = false;
            }
        },
        { signal },
    );
    return {
        get hasFocus() {
            return hasFocus;
        },
        reset() {
            hasFocus = false;
        },
    };
}
