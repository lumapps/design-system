/**
 * CSS selector for menu items (inner focusable element). Includes disabled items: per
 * WAI-ARIA APG they stay focusable so AT announces them; click is no-op'd via `aria-disabled`.
 */
export const MENU_ITEM_SELECTOR = '[data-menu-item]';

/** Get an item's text label (trimmed `textContent`) for typeahead matching. */
export function getItemText(item: HTMLElement): string {
    return item.textContent?.trim() ?? '';
}

/** Get all item elements within a menu container, in DOM order (includes disabled). */
export function getItems(menu: HTMLElement): HTMLElement[] {
    return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
}
