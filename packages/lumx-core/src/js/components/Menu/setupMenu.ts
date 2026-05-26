import { createListFocusNavigation, ListFocusNavigationController } from '../../utils/focusNavigation';
import { createTypeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { TABBABLE_ELEMENTS_SELECTOR, DISABLED_SELECTOR } from '../../utils/focus/constants';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';
import { MENU_ITEM_SELECTOR, getItems, getItemText } from './utils';
import type { MenuEventMap, MenuHandle, SetupMenuOptions } from './types';

/**
 * Find and focus the next sequential focusable element after the given trigger
 * in document tab order. Used by Tab-at-last-item to move focus forward past
 * the (now-closed) menu.
 */
function moveFocusAfterTrigger(trigger: HTMLElement) {
    const allFocusable = Array.from(document.querySelectorAll<HTMLElement>(TABBABLE_ELEMENTS_SELECTOR)).filter(
        (el) => !el.matches(DISABLED_SELECTOR) && el.tabIndex >= 0,
    );
    const triggerIdx = allFocusable.indexOf(trigger);
    if (triggerIdx === -1) return;
    const next = allFocusable[triggerIdx + 1];
    next?.focus();
}

/**
 * Set up a disclosure-pattern menu handle.
 *
 * The trigger is registered separately via {@link MenuHandle.registerTrigger}
 * once the trigger mounts. The menu container is registered separately via
 * {@link MenuHandle.registerMenu} once on mount — the popover uses
 * `closeMode="hide"` so the `<ul>` stays in the DOM at all times.
 *
 * IMPORTANT: this is the **disclosure widget** pattern, NOT WAI-ARIA's
 * `role="menu"`. Items are native `<button>` / `<a>` elements with `tabindex="0"`,
 * so screen readers announce them naturally and Tab navigates between them in
 * DOM order. There is no focus trap.
 *
 * @param options Options (menuId for `aria-controls`).
 * @returns A {@link MenuHandle} for interacting with the menu.
 */
export function setupMenu(options: SetupMenuOptions = {}): MenuHandle {
    const { menuId } = options;

    let trigger: HTMLElement | null = null;
    let menu: HTMLElement | null = null;
    let isOpenState = false;

    /** Handle-lifetime abort controller (typeahead, etc.). */
    const handleAbort = new AbortController();
    /** Per-registration controller for trigger listeners. */
    let triggerAbort: AbortController | null = null;
    /** Per-registration controller for menu list listeners. */
    let menuAbort: AbortController | null = null;
    /** List focus nav controller */
    let focusNav: ListFocusNavigationController | null = null;
    /** Menu handle */
    let handle: MenuHandle;

    /**
     * Shared typeahead controller (handle lifetime). Shared between the trigger and the
     * menu list so a character typed on the closed trigger lands in the same buffer that
     * in-menu typing reads.
     */
    const typeahead = createTypeahead(
        () => (menu ? createSelectorTreeWalker(menu, MENU_ITEM_SELECTOR) : null),
        getItemText,
        handleAbort.signal,
    );

    const subscribers: { [E in keyof MenuEventMap]: Set<(value: MenuEventMap[E]) => void> } = {
        open: new Set(),
    };

    function notify<E extends keyof MenuEventMap>(event: E, value: MenuEventMap[E]) {
        subscribers[event].forEach((cb) => cb(value));
    }

    /** Open the menu (if not already open), then navigate  */
    function openAndGoTo(resolve: Parameters<ListFocusNavigationController['goTo']>[0]) {
        if (!isOpenState) handle.setOpen(true);
        focusNav?.goTo(resolve);
    }

    /**
     * Accumulate a printable key into the shared typeahead buffer, then navigate to the
     * matching item using `goToItem` (immediate, for use inside the open menu).
     * Returns the matched item, or `null` when nothing matches.
     */
    function handleTypeaheadInMenu(key: string, currentItem: HTMLElement | null): HTMLElement | null {
        const match = typeahead.handle(key, currentItem);
        if (match) focusNav?.goTo(() => match);
        return match;
    }

    handle = {
        get trigger() {
            return trigger;
        },

        setOpen(open: boolean) {
            if (isOpenState === open) return;
            isOpenState = open;
            if (trigger) trigger.setAttribute('aria-expanded', String(open));
            notify('open', open);
        },

        registerTrigger(el: HTMLElement) {
            if (trigger && trigger !== el) {
                triggerAbort?.abort();
                triggerAbort = null;
            }
            trigger = el;

            triggerAbort = new AbortController();
            const { signal } = triggerAbort;

            // Set ARIA attributes.
            trigger.setAttribute('aria-haspopup', 'true');
            trigger.setAttribute('aria-expanded', String(isOpenState));
            if (menuId) trigger.setAttribute('aria-controls', menuId);

            // Click toggles the menu. When opening via click, focus the first item.
            trigger.addEventListener(
                'click',
                () => {
                    if (!isOpenState) {
                        openAndGoTo((n) => n.getFirst());
                    } else {
                        handle.setOpen(false);
                    }
                },
                { signal },
            );

            // Native `<button>` fires `click` on Enter/Space; other elements (Chip, role="button",
            // href-less `<a>`, …) don't, so we fire it manually.
            const needsManualActivation = trigger.tagName !== 'BUTTON';

            trigger.addEventListener(
                'keydown',
                (event) => {
                    switch (event.key) {
                        case 'ArrowDown':
                            event.preventDefault();
                            event.stopPropagation();
                            openAndGoTo((n) => n.getFirst());
                            break;

                        case 'ArrowUp':
                            event.preventDefault();
                            event.stopPropagation();
                            openAndGoTo((n) => n.getLast());
                            break;

                        case 'Enter':
                        case ' ':
                            // Native <button> already fires `click` on Enter/Space → skip to avoid double-toggle.
                            if (!needsManualActivation) break;
                            event.preventDefault();
                            event.stopPropagation();
                            el.click();
                            break;

                        default:
                            // Printable char on closed trigger → open menu, focus matching item.
                            // When open, the list-side handler owns typeahead (skip here to avoid
                            // double-buffering the char).
                            if (!isOpenState && isPrintableKey(event)) {
                                event.preventDefault();
                                event.stopPropagation();
                                // Buffer the char; items don't exist yet, matches on flushPendingNavigation
                                typeahead.handle(event.key, null);
                                focusNav?.goTo((n) => typeahead.rematch(n.activeItem) ?? n.getFirst());
                                handle.setOpen(true);
                            }
                            break;
                    }
                },
                { signal },
            );

            return () => {
                if (trigger === el) {
                    triggerAbort?.abort();
                    triggerAbort = null;
                    trigger = null;
                }
            };
        },

        registerMenu(el: HTMLElement) {
            if (menu && menu !== el) {
                menuAbort?.abort();
                menuAbort = null;
            }
            menu = el;

            menuAbort = new AbortController();
            const { signal } = menuAbort;

            // ── Focus navigation ──────────────────────────────────
            focusNav = createListFocusNavigation(
                {
                    type: 'list',
                    container: menu,
                    itemSelector: MENU_ITEM_SELECTOR,
                    wrap: true,
                    getActiveItem: () => {
                        const active = document.activeElement;
                        if (!active || !el.contains(active)) return null;
                        return active as HTMLElement;
                    },
                },
                {
                    onActivate: (item) => {
                        item.focus({ preventScroll: false });
                    },
                    onDeactivate: () => {
                        // No-op — focus moves naturally via item.focus().
                    },
                    onClear: () => {
                        // No-op.
                    },
                },
                signal,
            );

            // ── Keyboard handlers ─────────────────────────────────
            menu.addEventListener(
                'keydown',
                (event) => {
                    // Modifier+key combos other than Shift+Tab should pass through.
                    if (event.altKey || event.ctrlKey || event.metaKey) return;

                    switch (event.key) {
                        case 'ArrowDown':
                            event.preventDefault();
                            event.stopPropagation();
                            focusNav?.goDown();
                            break;

                        case 'ArrowUp':
                            event.preventDefault();
                            event.stopPropagation();
                            focusNav?.goUp();
                            break;

                        case 'Home':
                            event.preventDefault();
                            event.stopPropagation();
                            focusNav?.goTo((s) => s.getFirst());
                            break;

                        case 'End':
                            event.preventDefault();
                            event.stopPropagation();
                            focusNav?.goTo((s) => s.getLast());
                            break;

                        case 'Escape':
                            event.preventDefault();
                            event.stopPropagation();
                            // Focus trigger before closing: with closeMode="hide" items unmount,
                            // which would otherwise leave focus on body.
                            trigger?.focus();
                            handle.setOpen(false);
                            break;

                        case 'Tab': {
                            // Tab-at-edge: close menu and move focus manually. The popover stays
                            // mounted (closeMode="hide") but items unmount on close, so the focused
                            // item disappears before the browser resolves the next tab stop. Blur the
                            // active item (so Popover skips focus-restore), close, then move focus
                            // forward (Tab) or to the trigger (Shift+Tab).
                            const items = getItems(el);
                            if (items.length === 0) return;
                            const idx = items.indexOf(document.activeElement as HTMLElement);
                            if (idx === -1) return;

                            if (event.shiftKey && idx === 0) {
                                event.preventDefault();
                                // Focus trigger explicitly for deterministic timing.
                                trigger?.focus();
                                handle.setOpen(false);
                            } else if (!event.shiftKey && idx === items.length - 1) {
                                event.preventDefault();
                                // Blur active item so focusAnchorOnClose won't kick in.
                                (document.activeElement as HTMLElement)?.blur();
                                handle.setOpen(false);
                                // After unmount, focus the next element after the trigger.
                                setTimeout(() => {
                                    if (trigger) moveFocusAfterTrigger(trigger);
                                }, 0);
                            }
                            break;
                        }

                        default:
                            // Printable characters → typeahead among visible items, navigate immediately.
                            if (isPrintableKey(event)) {
                                const active = document.activeElement;
                                const currentItem = active && el.contains(active) ? (active as HTMLElement) : null;
                                const match = handleTypeaheadInMenu(event.key, currentItem);
                                if (match) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }
                            break;
                    }
                },
                { signal },
            );

            return () => {
                if (menu === el) {
                    menuAbort?.abort();
                    menuAbort = null;
                    menu = null;
                }
            };
        },

        flushPendingNavigation() {
            focusNav?.flushPendingNavigation();
        },

        subscribe<E extends keyof MenuEventMap>(event: E, listener: (value: MenuEventMap[E]) => void) {
            subscribers[event].add(listener);
            return () => {
                subscribers[event].delete(listener);
            };
        },

        destroy() {
            handleAbort.abort();
            triggerAbort?.abort();
            menuAbort?.abort();
            triggerAbort = null;
            menuAbort = null;
            trigger = null;
            menu = null;
            isOpenState = false;
            for (const set of Object.values(subscribers)) {
                set.clear();
            }
        },
    };

    return handle;
}
