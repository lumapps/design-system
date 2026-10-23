import type { CompositeEventMap, CompositeHandle, CompositeOptions } from '../Composite/types';
import { COMBOBOX_POPOVER_CLASSNAME } from './constants';
import type { ComboboxCallbacks, ComboboxEventMap, ComboboxHandle, OnTriggerAttach } from './types';

/** Options of {@link setupCombobox}: the callbacks, and the shared combobox behavior options. */
interface SetupComboboxOptions extends ComboboxCallbacks {
    /** When true, ArrowDown/ArrowUp wrap around in listbox mode (input pattern). Default: false. */
    wrapNavigation?: boolean;
    /**
     * Called when the trigger is registered and the signal is ready. Used by the mode-specific wrappers
     * (setupComboboxInput/Button) to attach the controller of their mode.
     */
    onTriggerAttach?: OnTriggerAttach;
}

/**
 * Set up combobox behavior (WAI-ARIA combobox pattern) on a trigger + list pair.
 *
 * The trigger and the list are registered separately via the returned handle,
 * allowing framework components to register them on mount. The behavior is
 * fully attached once both are registered. The list is late-bound: the list component attaches its
 * composite handle with `handle.attachList`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * @param options The callbacks (e.g. option selection) and the shared combobox behavior options.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupCombobox(options: SetupComboboxOptions = {}): ComboboxHandle {
    const { wrapNavigation = false, onTriggerAttach, ...callbacks } = options;

    let trigger: HTMLInputElement | HTMLButtonElement | null = null;
    /** The attached list (see `attachList`). */
    let list: CompositeHandle | null = null;
    /** Cleanup of the subscriptions on the registered list. */
    let unsubscribeList: (() => void) | null = null;

    /** The popup open state (source of truth, forwarded to the registered list). */
    let isOpen = false;
    /** The trigger `aria-expanded` (see {@link ComboboxEventMap.expanded}). */
    let isExpanded = false;
    /** When true, the list stays open (inline list, no popup to open or close). */
    let alwaysOpen = false;
    /** Whether the mounted list is inline (not in a `Combobox.Popover`). */
    let isInline = false;
    /** Forced `alwaysOpen` value (`undefined`: from the list placement, see {@link isInline}). */
    let alwaysOpenOverride: boolean | undefined;

    /** AbortController for all trigger event listeners. */
    let abortController: AbortController | null = null;

    /** Events owned by the combobox. The other events are forwarded from the attached list. */
    type OwnEvent = 'open' | 'expanded' | 'composite';
    const isOwnEvent = (event: keyof ComboboxEventMap): event is OwnEvent =>
        event === 'open' || event === 'expanded' || event === 'composite';
    const subscribers: { [K in OwnEvent]: Set<(value: ComboboxEventMap[K]) => void> } = {
        open: new Set(),
        expanded: new Set(),
        composite: new Set(),
    };

    function notify<K extends OwnEvent>(event: K, value: ComboboxEventMap[K]) {
        for (const cb of subscribers[event] as Set<(v: ComboboxEventMap[K]) => void>) cb(value);
    }

    /** Listeners of a forwarded list event, and the subscription on the current list that feeds them. */
    interface ForwardedEvent {
        listeners: Set<(value: unknown) => void>;
        unsubscribe: (() => void) | null;
    }
    const forwardedEvents = new Map<keyof CompositeEventMap, ForwardedEvent>();

    /** Subscribe the forwarded event on the current list (null without a list). Returns the unsubscribe. */
    function forwardEvent(event: keyof CompositeEventMap, listeners: ForwardedEvent['listeners']) {
        return list ? list.subscribe(event, (value) => listeners.forEach((cb) => cb(value))) : null;
    }

    /** List change: forward the events from the new list, and dispatch its snapshots (undefined without a list). */
    function syncForwardedEvents() {
        for (const [event, forwarded] of forwardedEvents) {
            forwarded.unsubscribe?.();
            forwarded.unsubscribe = forwardEvent(event, forwarded.listeners);
            const value = list?.getSnapshot(event);
            forwarded.listeners.forEach((cb) => cb(value));
        }
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

    /**
     * Mirror the pattern of the mounted list on the trigger `aria-haspopup` (`grid`, `tree`, …), including back to
     * `listbox` when another list replaces a grid. `listbox` is the ARIA default: it is not added to a trigger
     * that has no `aria-haspopup`.
     */
    function syncHasPopup() {
        const type = list?.type;
        if (!trigger || !type) return;
        if (type !== 'listbox' || trigger.hasAttribute('aria-haspopup')) trigger.setAttribute('aria-haspopup', type);
    }

    /**
     * Sync `aria-expanded` on the trigger, and fire `expanded` when it changed: true when the popup is open
     * and the list has something to show (visible items or root skeletons), which changes with the open
     * state, filtering, item register/unregister and skeleton transitions.
     */
    function syncExpanded() {
        const expanded = isOpen && !!list?.hasVisibleContent;
        trigger?.setAttribute('aria-expanded', String(expanded));
        if (expanded === isExpanded) return;
        isExpanded = expanded;
        notify('expanded', expanded);
    }

    /** Options of the list handle: the combobox links it to the trigger (focus owner). */
    const listOptions: CompositeOptions = {
        wrapNavigation,
        onSelect(option, element) {
            callbacks.onSelect?.(option);
            // Close on selection (when not multiselectable)
            if (element && !list?.isMultiSelect) {
                list?.clearActiveItem();
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
                syncHasPopup();
                // No `Combobox.Popover` around the list: inline list, always open.
                isInline = !element.closest(`.${COMBOBOX_POPOVER_CLASSNAME}`);
                syncAlwaysOpen();
            },
        },
    };

    /** Unregister the current list (unsubscribe, no destroy: its `detach` destroys it). */
    function releaseList() {
        unsubscribeList?.();
        unsubscribeList = null;
        list = null;
    }

    /** Detach everything (abort all listeners, clear state). */
    function detach() {
        // Clear the active option while the old trigger is still the focus owner.
        list?.clearActiveItem();
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
                        if (!altKey) list?.activateDefaultItem('first');
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
                        list?.activateDefaultItem('last');
                    } else if (handle.isOpen && (list?.activeItem || !altKey)) {
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
                        if (list?.activeItem) {
                            list.clearActiveItem();
                            flag = true;
                        }
                    } else if (handle.isOpen) {
                        handle.setIsOpen(false);
                        flag = true;
                    } else if (triggerEl.tagName === 'INPUT' && triggerEl.value) {
                        // Clear the selection (the same as `list.select(null)`, also without a list).
                        listOptions.onSelect?.({ value: '' }, null);
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
        syncHasPopup();
        if (!abortController) {
            abortController = new AbortController();
        }

        // Initialize ARIA on trigger
        if (!trigger.getAttribute('aria-activedescendant')) {
            trigger.setAttribute('aria-activedescendant', '');
        }
        syncExpanded();

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
        get isOpen() {
            return isOpen;
        },
        get alwaysOpen() {
            return alwaysOpen;
        },

        setIsOpen(open: boolean) {
            // Always open: a close request only clears the active option.
            if (alwaysOpen && !open) {
                list?.clearActiveItem();
                return;
            }
            if (isOpen === open) return;
            isOpen = open;
            if (!open) list?.clearActiveItem();
            // Update aria-expanded on trigger (false when no visible options or skeletons)
            syncExpanded();
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

        attachList(createList) {
            const newList = createList(listOptions);
            releaseList();
            list = newList;
            // The visible items and the loading state (`hasVisibleContent`) are fields of the live region state.
            unsubscribeList = newList.subscribe('stateChange', syncExpanded);
            // Forward the open state (the list may attach after the popup opened). (`aria-haspopup`: on mount.)
            newList.setOpen(isOpen);
            syncExpanded();
            syncForwardedEvents();
            notify('composite', newList);
            return {
                list: newList,
                detach() {
                    // Unregister before the destroy: the combobox never reads a destroyed list.
                    if (list === newList) {
                        releaseList();
                        // No list left: nothing to show (the list options may unregister after this, unobserved).
                        syncExpanded();
                        syncForwardedEvents();
                        notify('composite', null);
                    }
                    newList.destroy();
                },
            };
        },

        subscribe(event, callback) {
            if (isOwnEvent(event)) {
                const eventSubscribers = subscribers[event] as Set<typeof callback>;
                eventSubscribers.add(callback);
                // Replay the open state to late subscribers (e.g. async Vue watchers).
                if (event === 'open' && isOpen) (callback as (value: boolean) => void)(true);
                return () => {
                    eventSubscribers.delete(callback);
                };
            }
            // Forwarded list event: one subscription per event on the current list feeds all the callbacks.
            let forwarded = forwardedEvents.get(event);
            if (!forwarded) {
                const listeners: ForwardedEvent['listeners'] = new Set();
                forwarded = { listeners, unsubscribe: forwardEvent(event, listeners) };
                forwardedEvents.set(event, forwarded);
            }
            const forwardedCallback = callback as (value: unknown) => void;
            forwarded.listeners.add(forwardedCallback);
            // Replay the current list snapshot to the late subscriber.
            const value = list?.getSnapshot(event);
            if (value !== undefined) forwardedCallback(value);
            return () => {
                forwarded.listeners.delete(forwardedCallback);
                if (forwarded.listeners.size) return;
                forwarded.unsubscribe?.();
                forwardedEvents.delete(event);
            };
        },

        getSnapshot<K extends keyof ComboboxEventMap>(event: K): ComboboxEventMap[K] | undefined {
            if (isOwnEvent(event)) {
                const own: { [E in OwnEvent]: ComboboxEventMap[E] } = {
                    open: isOpen,
                    expanded: isExpanded,
                    composite: list,
                };
                return own[event] as ComboboxEventMap[K];
            }
            return list?.getSnapshot(event as keyof CompositeEventMap) as ComboboxEventMap[K] | undefined;
        },

        destroy() {
            detach();
            trigger = null;
            releaseList();
            isOpen = false;
            isExpanded = false;
            for (const set of Object.values(subscribers)) set.clear();
            for (const forwarded of forwardedEvents.values()) forwarded.unsubscribe?.();
            forwardedEvents.clear();
        },
    };

    return handle;
}
