import { DISABLED_SELECTOR, TABBABLE_ELEMENTS_SELECTOR } from './constants';

const isNotDisabled = (element: HTMLElement) => !element.matches(DISABLED_SELECTOR);

export function getFocusableElements(element: HTMLElement | ShadowRoot): HTMLElement[] {
    return Array.from(element.querySelectorAll<HTMLElement>(TABBABLE_ELEMENTS_SELECTOR)).filter(isNotDisabled);
}
