import { isSelected } from '../Composite/utils';
import type { CompositeHandle, CompositeOptions } from '../Composite/types';
import { COMBOBOX_POPOVER_CLASSNAME } from './constants';
import type { ComboboxCallbacks, ComboboxEventMap, ComboboxHandle, OnTriggerAttach } from './types';

/** Options for configuring the shared combobox behavior. */
interface ComboboxOptions {
    /** When true, ArrowDown/ArrowUp wrap around in listbox mode (input pattern). Default: false. */
    wrapNavigation?: boolean;
}

/**
 * Set up combobox behavior (WAI-ARIA combobox pattern) on a trigger + list pair.
 *
 * The trigger and the list are registered separately via the returned handle,
 * allowing framework components to register them on mount. The behavior is
 * fully attached once both are registered. The list is late-bound: the list component creates its
 * composite handle with `handle.listOptions` and registers it with `handle.registerList`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * @param callbacks Callbacks invoked on combobox events (e.g. option selection).
 * @param options Options for configuring the shared combobox behavior.
 * @param onTriggerAttach Optional callback invoked when the trigger is registered and the signal is ready.
 *                        Used by mode-specific wrappers (setupComboboxInput/Button) to automatically
 *                        attach the appropriate controller.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupCombobox(
    callbacks: ComboboxCallbacks,
    options?: ComboboxOptions,
    onTriggerAttach?: OnTriggerAttach,
): ComboboxHandle {
    const { wrapNavigation = false } = options ?? {};

    let trigger: HTMLInputElement | HTMLButtonElement | null = null;
    /** The registered list (the list component creates it with `listOptions`). */
    let list: CompositeHandle | null = null;
    /** Cleanup of the subscriptions on the registered list. */
    let unsubscribeList: (() => void) | null = null;

    /** The popup open state (source of truth, forwarded to the registered list). */
    let isOpen = false;
    /** When true, the list stays open (inline list, no popup to open or close). */
    let alwaysOpen = false;
    /** Whether the mounted list is inline (not in a `Combobox.Popover`). */
    let isInline = false;
    /** Forced `alwaysOpen` value (`undefined`: from the list placement, see {@link isInline}). */
    let alwaysOpenOverride: boolean | undefined;

    /** AbortController for all trigger event listeners. */
    let abortController: AbortController | null = null;

    const subscribers: { [K in keyof ComboboxEventMap]: Set<(value: ComboboxEventMap[K]) => void> } = {
        open: new Set(),
        list: new Set(),
    };

    function notify<K extends keyof ComboboxEventMap>(event: K, value: ComboboxEventMap[K]) {
        for (const cb of subscribers[event] as Set<(v: ComboboxEventMap[K]) => void>) cb(value);
    }

    // Forward-declared so internal helpers can reference `handle` before it is constructed (via closure).
    let handle!: ComboboxHandle;

    /** Apply the `alwaysOpen` value (override, or else the list placement). */
    function syncAlwaysOpen() {
        const value = alwaysOpenOverride ?? isInline;
        if (alwaysOpen === value) return;
        alwaysOpen = value;
        handle.setIsOpen(value);
    }

    /** Set `aria-haspopup="grid"` on the trigger when the list is a grid. */
    function syncHasPopup(element: HTMLElement | null) {
        if (trigger && element?.getAttribute('role') === 'grid') trigger.setAttribute('aria-haspopup', 'grid');
    }

    /**
     * Keep `aria-expanded` in sync while open: it is false when there is nothing to show
     * (no visible option and no skeleton), which changes with filtering, option register/unregister
     * and skeleton transitions.
     */
    function syncExpanded() {
        if (isOpen) trigger?.setAttribute('aria-expanded', String(!!list?.hasVisibleContent));
    }

    /** Options of the list handle: the combobox links it to the trigger (focus owner). */
    const listOptions: CompositeOptions = {
        wrapNavigation,
        onSelect(option, element) {
            callbacks.onSelect?.(option);
            // Close on selection (when not multiselectable)
            if (element && !list?.isMultiSelect) {
                list?.focusNav?.clear();
                // Defer the close to the next frame (to make sure all other click handler resolve).
                requestAnimationFrame(() => {
                    handle.setIsOpen(false);
                });
            }
        },
        focusOwner: {
            getFocusOwner: () => trigger,
            getInputValue: () => trigger?.value ?? '',
            onMount: (element) => {
                syncHasPopup(element);
                // No `Combobox.Popover` around the list: inline list, always open.
                isInline = !element.closest(`.${COMBOBOX_POPOVER_CLASSNAME}`);
                syncAlwaysOpen();
            },
        },
    };

    /** Unregister the current list (unsubscribe, no destroy: the list component owns it). */
    function releaseList() {
        unsubscribeList?.();
        unsubscribeList = null;
        list = null;
    }

    /** Detach everything (abort all listeners, clear state). */
    function detach() {
        // Clear the active option while the old trigger is still the focus owner.
        list?.focusNav?.clear();
        abortController?.abort();
        abortController = null;
    }

    /**
     * Attach the shared keydown listener to the trigger.
     *
     * Handles what is combobox-specific: open on ArrowDown/ArrowUp, the Enter close rule, Escape (2-tier)
     * and the Alt modifiers. The navigation itself is delegated to `list.handleKeydown`.
     * Mode-specific keys (Space, Home, End, ArrowLeft/Right, printable chars, etc.)
     * are delegated to the `onKeydown` hook provided by the mode controller.
     */
    function attachTriggerKeydown(
        triggerEl: HTMLInputElement | HTMLButtonElement,
        signal: AbortSignal,
        onKeydown?: (event: KeyboardEvent) => boolean,
    ) {
        function handleKeydown(event: KeyboardEvent) {
            // Let the mode-specific handler run first.
            if (onKeydown?.(event)) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            let flag = false;
            const { altKey } = event;
            const nav = list?.focusNav;

            switch (event.key) {
                case 'Enter':
                    // Open with an active option: "click" it (handled by the list).
                    if (handle.isOpen && list?.handleKeydown(event)) {
                        flag = true;
                    } else if (handle.isOpen && !list?.isMultiSelect) {
                        // Open with no active item (single select) => close the popup,
                        // but let Enter propagate so it can submit a surrounding form.
                        handle.setIsOpen(false);
                    }
                    // Otherwise (closed popup, or multi-select with no active item),
                    // let Enter pass through so it can submit a surrounding form
                    break;

                // Open if closed, else move the active option (handled by the list).
                case 'ArrowDown':
                    if (!handle.isOpen) {
                        handle.setIsOpen(true);
                        // Focus first or selected item on open (deferred until the options commit).
                        if (!altKey) nav?.goTo((s) => s.getMatching(isSelected) ?? s.getFirst());
                    } else if (!altKey) {
                        list?.handleKeydown(event);
                    }
                    flag = true;
                    break;

                // Open if closed, else move the active option (handled by the list).
                case 'ArrowUp':
                    if (!handle.isOpen && !altKey) {
                        handle.setIsOpen(true);
                        // Focus last or selected item on open (deferred until the options commit).
                        nav?.goTo((s) => s.getMatching(isSelected) ?? s.getLast());
                    } else if (handle.isOpen && (nav?.selectors.activeItem || !altKey)) {
                        // Alt+ArrowUp only moves when there is an active option.
                        list?.handleKeydown(event);
                    }
                    flag = true;
                    break;

                case 'Escape':
                    // 2-tier: close if open, otherwise clear the input value.
                    // Always open: only clear the active option (never the selected value, which stays visible).
                    // When there is nothing to close or clear, let Escape propagate
                    // (ex: so a surrounding dialog can close).
                    if (alwaysOpen) {
                        if (nav?.selectors.activeItem) {
                            nav.clear();
                            flag = true;
                        }
                    } else if (handle.isOpen) {
                        handle.setIsOpen(false);
                        flag = true;
                    } else if (triggerEl.tagName === 'INPUT' && triggerEl.value) {
                        if (list) list.select(null);
                        else callbacks.onSelect?.({ value: '' });
                        flag = true;
                    }
                    break;

                case 'PageUp':
                case 'PageDown':
                    if (handle.isOpen) list?.handleKeydown(event);
                    flag = true;
                    break;

                default:
                    break;
            }

            if (flag) {
                event.stopPropagation();
                event.preventDefault();
            }
        }

        triggerEl.addEventListener('keydown', (e) => handleKeydown(e as KeyboardEvent), { signal });
    }

    /** Try to fully attach when the trigger is available. */
    function tryAttach() {
        if (!trigger) return;

        // Create a fresh abort controller if needed
        const isNewController = !abortController;
        syncHasPopup(list?.element ?? null);
        if (!abortController) {
            abortController = new AbortController();
        }

        // Initialize ARIA on trigger
        if (!trigger.getAttribute('aria-activedescendant')) {
            trigger.setAttribute('aria-activedescendant', '');
        }
        trigger.setAttribute('aria-expanded', String(isOpen));

        // On first attach, wire up the mode-specific controller, shared keydown, and focusout handlers.
        if (isNewController) {
            const onKeydown = onTriggerAttach?.(handle, abortController.signal) || undefined;
            attachTriggerKeydown(trigger, abortController.signal, onKeydown);

            // Close the popup when the trigger loses focus
            trigger.addEventListener(
                'focusout',
                () => {
                    handle.setIsOpen(false);
                },
                { signal: abortController.signal },
            );
        }
    }

    handle = {
        get trigger() {
            return trigger;
        },
        get list() {
            return list;
        },
        get listOptions() {
            return listOptions;
        },
        get isOpen() {
            return isOpen;
        },
        get alwaysOpen() {
            return alwaysOpen;
        },

        setIsOpen(open: boolean) {
            // Always open: a close request only clears the active option.
            if (alwaysOpen && !open) {
                list?.focusNav?.clear();
                return;
            }
            if (isOpen === open) return;
            isOpen = open;
            if (!open) list?.focusNav?.clear();
            // Update aria-expanded on trigger (false when no visible options or skeletons)
            trigger?.setAttribute('aria-expanded', String(open && !!list?.hasVisibleContent));
            // Last: the list and the combobox dispatch `open` to the subscribers, which must see the trigger
            // in its final state.
            list?.setOpen(open);
            notify('open', open);
        },

        setAlwaysOpen(value: boolean | undefined) {
            alwaysOpenOverride = value;
            syncAlwaysOpen();
        },

        registerTrigger(newTrigger: HTMLInputElement | HTMLButtonElement): () => void {
            // If replacing a trigger, detach first
            if (trigger && trigger !== newTrigger) {
                detach();
            }
            trigger = newTrigger;
            tryAttach();

            return () => {
                if (trigger === newTrigger) {
                    detach();
                    trigger = null;
                }
            };
        },

        registerList(newList: CompositeHandle): () => void {
            if (list !== newList) {
                releaseList();
                list = newList;
                const unsubscribes = [
                    newList.subscribe('optionsChange', syncExpanded),
                    newList.subscribe('loadingChange', syncExpanded),
                ];
                unsubscribeList = () => unsubscribes.forEach((unsubscribe) => unsubscribe());
                // Forward the open state (the list may register after the popup opened).
                newList.setOpen(isOpen);
                syncHasPopup(newList.element);
                syncExpanded();
                notify('list', newList);
            }
            return () => {
                if (list !== newList) return;
                releaseList();
                // No list left: nothing to show (the list options may unregister after this, unobserved).
                syncExpanded();
                notify('list', null);
            };
        },

        subscribe(event, callback) {
            const eventSubscribers = subscribers[event] as Set<typeof callback>;
            eventSubscribers.add(callback);
            // Replay the open state to late subscribers (e.g. async Vue watchers), like the list does.
            if (event === 'open' && isOpen) (callback as (value: boolean) => void)(true);
            return () => {
                eventSubscribers.delete(callback);
            };
        },

        getSnapshot(event) {
            return (event === 'open' ? isOpen : list) as ComboboxEventMap[typeof event];
        },

        destroy() {
            detach();
            trigger = null;
            releaseList();
            isOpen = false;
            for (const set of Object.values(subscribers)) set.clear();
        },
    };

    return handle;
}
