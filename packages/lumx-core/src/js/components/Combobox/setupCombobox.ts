import { setupListbox } from '../Listbox/setupListbox';
import { COMBOBOX_POPOVER_CLASSNAME } from './constants';
import type { ComboboxCallbacks, ComboboxHandle, OnTriggerAttach } from './types';

/** Options for configuring the shared combobox behavior. */
interface ListboxOptions {
    /** When true, ArrowDown/ArrowUp wrap around in listbox mode (input pattern). Default: false. */
    wrapNavigation?: boolean;
}

/**
 * Set up combobox behavior (WAI-ARIA combobox pattern) on a trigger + listbox pair.
 *
 * The trigger and listbox are registered separately via the returned handle,
 * allowing framework components to register them on mount. The behavior is
 * fully attached once both are registered.
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
    options?: ListboxOptions,
    onTriggerAttach?: OnTriggerAttach,
): ComboboxHandle {
    const { wrapNavigation = false } = options ?? {};

    let trigger: HTMLInputElement | HTMLButtonElement | null = null;

    /** When true, the listbox stays open (inline listbox, no popup to open or close). */
    let alwaysOpen = false;
    /** Whether the mounted listbox is inline (not in a `Combobox.Popover`). */
    let isInline = false;
    /** Forced `alwaysOpen` value (`undefined`: from the listbox placement, see {@link isInline}). */
    let alwaysOpenOverride: boolean | undefined;

    /** AbortController for all trigger event listeners. */
    let abortController: AbortController | null = null;

    // Forward-declared so internal helpers can reference `handle` before it is constructed (via closure).
    let handle!: ComboboxHandle;

    /** Apply the `alwaysOpen` value (override, or else the listbox placement). */
    function syncAlwaysOpen() {
        const value = alwaysOpenOverride ?? isInline;
        if (alwaysOpen === value) return;
        alwaysOpen = value;
        handle.setIsOpen(value);
    }

    /** Set `aria-haspopup="grid"` on the trigger when the listbox is a grid. */
    function syncHasPopup(listbox: HTMLElement | null) {
        if (trigger && listbox?.getAttribute('role') === 'grid') trigger.setAttribute('aria-haspopup', 'grid');
    }

    /**
     * The listbox handle owns the open state, the option/section/skeleton registry, the filter, the focus
     * navigation, the selection and all the events. The combobox links it to the trigger (focus owner).
     */
    const list = setupListbox({
        wrapNavigation,
        onSelect(option, element) {
            callbacks.onSelect?.(option);
            // Close on selection (when not multiselectable)
            if (element && !list.isMultiSelect) {
                list.clearActiveItem();
                // Defer the close to the next frame (to make sure all other click handler resolve).
                requestAnimationFrame(() => {
                    handle.setIsOpen(false);
                });
            }
        },
        focusOwner: {
            getFocusOwner: () => trigger,
            getInputValue: () => trigger?.value ?? '',
            onMount: (listbox) => {
                syncHasPopup(listbox);
                // No `Combobox.Popover` around the listbox: inline listbox, always open.
                isInline = !listbox.closest(`.${COMBOBOX_POPOVER_CLASSNAME}`);
                syncAlwaysOpen();
            },
        },
    });

    /**
     * Keep `aria-expanded` in sync while open: it is false when there is nothing to show
     * (no visible option and no skeleton), which changes with filtering, option register/unregister
     * and skeleton transitions. Unsubscribed by `list.destroy()`.
     */
    function syncExpanded() {
        if (list.isOpen) trigger?.setAttribute('aria-expanded', String(list.hasVisibleContent));
    }
    list.subscribe('optionsChange', syncExpanded);
    list.subscribe('loadingChange', syncExpanded);

    /** Detach everything (abort all listeners, clear state). */
    function detach() {
        // Clear the active option while the old trigger is still the focus owner.
        list.clearActiveItem();
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
                    // Open with an active option: "click" it (handled by the listbox).
                    if (handle.isOpen && list.handleKeydown(event)) {
                        flag = true;
                    } else if (handle.isOpen && !list.isMultiSelect) {
                        // Open with no active item (single select) => close the popup,
                        // but let Enter propagate so it can submit a surrounding form.
                        handle.setIsOpen(false);
                    }
                    // Otherwise (closed popup, or multi-select with no active item),
                    // let Enter pass through so it can submit a surrounding form
                    break;

                // Open if closed, else move the active option (handled by the listbox).
                case 'ArrowDown':
                    if (!handle.isOpen) {
                        handle.setIsOpen(true);
                        // Focus first or selected item on open (deferred until the options commit).
                        if (!altKey) list.activateDefaultItem('first');
                    } else if (!altKey) {
                        list.handleKeydown(event);
                    }
                    flag = true;
                    break;

                // Open if closed, else move the active option (handled by the listbox).
                case 'ArrowUp':
                    if (!handle.isOpen && !altKey) {
                        handle.setIsOpen(true);
                        // Focus last or selected item on open (deferred until the options commit).
                        list.activateDefaultItem('last');
                    } else if (handle.isOpen && (list.activeItem || !altKey)) {
                        // Alt+ArrowUp only moves when there is an active option.
                        list.handleKeydown(event);
                    }
                    flag = true;
                    break;

                case 'Escape':
                    // 2-tier: close if open, otherwise clear the input value.
                    // Always open: only clear the active option (never the selected value, which stays visible).
                    // When there is nothing to close or clear, let Escape propagate
                    // (ex: so a surrounding dialog can close).
                    if (alwaysOpen) {
                        if (list.activeItem) {
                            list.clearActiveItem();
                            flag = true;
                        }
                    } else if (handle.isOpen) {
                        handle.setIsOpen(false);
                        flag = true;
                    } else if (triggerEl.tagName === 'INPUT' && triggerEl.value) {
                        list.select(null);
                        flag = true;
                    }
                    break;

                case 'PageUp':
                case 'PageDown':
                    if (handle.isOpen) list.handleKeydown(event);
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

    /** Try to fully attach when both trigger and listbox are available. */
    function tryAttach() {
        if (!trigger) return;

        // Create a fresh abort controller if needed
        const isNewController = !abortController;
        syncHasPopup(list.element);
        if (!abortController) {
            abortController = new AbortController();
        }

        // Initialize ARIA on trigger
        if (!trigger.getAttribute('aria-activedescendant')) {
            trigger.setAttribute('aria-activedescendant', '');
        }
        trigger.setAttribute('aria-expanded', String(list.isOpen));

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
            return list.isOpen;
        },
        get alwaysOpen() {
            return alwaysOpen;
        },

        setIsOpen(isOpen: boolean) {
            // Always open: a close request only clears the active option.
            if (alwaysOpen && !isOpen) {
                list.clearActiveItem();
                return;
            }
            if (list.isOpen === isOpen) return;
            if (!isOpen) list.clearActiveItem();
            // Update aria-expanded on trigger (false when no visible options or skeletons)
            trigger?.setAttribute('aria-expanded', String(isOpen && list.hasVisibleContent));
            // Last: the listbox dispatches `open` to the subscribers, which must see the trigger in its final state.
            list.setOpen(isOpen);
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

        destroy() {
            detach();
            trigger = null;
            list.destroy();
        },
    };

    return handle;
}
