import { type FocusNavigationController } from '../../utils/focusNavigation';
import {
    getOptionValue,
    goToSelectedOrFirst,
    goToSelectedOrLast,
    isActionCell,
    isOptionDisabled,
    notifySection,
} from './utils';
import { setupListbox } from './setupListbox';
import type {
    ComboboxCallbacks,
    ComboboxEventMap,
    ComboboxHandle,
    OnTriggerAttach,
    OptionRegistration,
    SectionRegistration,
} from './types';

/** Options for configuring the shared combobox behavior. */
interface ComboboxOptions {
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
 * @param callbacks Callbacks for select and open/close events.
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
    let listbox: HTMLElement | null = null;
    let focusNav: FocusNavigationController | null = null;
    let isOpenState = false;

    /** Current filter value (empty string = no filtering). */
    let filterValue = '';

    /** Registered options: maps DOM element → { callback, last notified state }. */
    const optionRegistrations = new Map<HTMLElement, OptionRegistration>();

    /** Registered sections: maps DOM element → { callback, last notified state }. */
    const sectionRegistrations = new Map<HTMLElement, SectionRegistration>();

    /** AbortController for all structural event listeners. */
    let abortController: AbortController | null = null;

    /** Last notified isEmpty state, to avoid redundant `emptyChange` notifications. */
    let lastIsEmpty = true;

    /** Event subscribers managed by the handle. */
    const subscribers: { [K in keyof ComboboxEventMap]: Set<(value: ComboboxEventMap[K]) => void> } = {
        open: new Set(),
        activeDescendantChange: new Set(),
        emptyChange: new Set(),
        loadingChange: new Set(),
        loadingAnnouncement: new Set(),
    };

    /** Notify all subscribers for a given event. */
    function notify<K extends keyof ComboboxEventMap>(event: K, value: ComboboxEventMap[K]) {
        subscribers[event].forEach((cb) => cb(value));
    }

    /**
     * Notify all registered sections and fire `emptyChange` if the visible option count changed.
     * Called whenever the set of visible options may have changed (option register/unregister, filter change).
     */
    function notifyVisibilityChange() {
        for (const [sectionElement] of sectionRegistrations) {
            notifySection(sectionElement, sectionRegistrations, optionRegistrations);
        }

        let visibleCount = 0;
        for (const reg of optionRegistrations.values()) {
            if (!reg.lastFiltered) visibleCount += 1;
        }
        const isEmpty = visibleCount === 0;
        if (isEmpty !== lastIsEmpty) {
            lastIsEmpty = isEmpty;
            const inputValue = trigger?.value ?? '';
            notify('emptyChange', { isEmpty, inputValue });
        }
    }

    // ── Skeleton loading tracking ──────────────────────────────

    /** Delay before announcing loading in the live region (ms). */
    const LOADING_ANNOUNCEMENT_DELAY = 500;

    /** Number of currently mounted skeleton placeholders. */
    let skeletonCount = 0;

    /** Timer for debounced loading announcement. */
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;

    /**
     * Called when the skeleton count transitions between 0 and >0 (or vice versa).
     * Fires `loadingChange` immediately and manages the debounced `loadingAnnouncement`.
     */
    function onSkeletonCountChange() {
        const isLoading = skeletonCount > 0;
        notify('loadingChange', isLoading);
        clearTimeout(loadingTimer);

        if (isLoading) {
            loadingTimer = setTimeout(() => {
                if (skeletonCount > 0) {
                    notify('loadingAnnouncement', true);
                }
            }, LOADING_ANNOUNCEMENT_DELAY);
        } else {
            notify('loadingAnnouncement', false);
        }
    }

    // Forward-declared so internal helpers (keydown handler, listbox listeners, etc.)
    // can reference `handle` before the object is fully constructed (via closure).
    // The handle is assigned immediately below and is always available by the time these helpers run.
    let handle!: ComboboxHandle;

    /** Detach everything (abort all listeners, clear state). */
    function detach() {
        abortController?.abort();
        abortController = null;
        focusNav = null;
    }

    /**
     * Attach the shared keydown listener to the trigger.
     *
     * Handles: Enter, ArrowDown, ArrowUp, Escape (2-tier), Tab, PageUp, PageDown.
     * Mode-specific keys (Space, Home, End, ArrowLeft/Right, printable chars, etc.)
     * are delegated to the `onKeydown` hook provided by the mode controller.
     */
    function attachTriggerKeydown(
        triggerEl: HTMLInputElement | HTMLButtonElement,
        signal: AbortSignal,
        onKeydown?: (event: KeyboardEvent) => boolean,
    ) {
        function handleKeydown(event: KeyboardEvent) {
            if (event.ctrlKey || event.shiftKey) return;

            // Let the mode-specific handler run first.
            if (onKeydown?.(event)) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            let flag = false;
            const { altKey } = event;
            const nav = handle.focusNav;

            switch (event.key) {
                case 'Enter':
                    if (handle.isOpen && nav?.hasActiveItem && nav.activeItem) {
                        if (!isOptionDisabled(nav.activeItem)) {
                            if (nav.type === 'grid' && isActionCell(nav.activeItem)) {
                                // Action cell: programmatically click it.
                                nav.activeItem.click();
                            } else {
                                // Option cell: select the option.
                                handle.select(nav.activeItem);
                            }
                        }
                    }
                    // In multi-select mode, keep open after selection; otherwise toggle.
                    if (!handle.isMultiSelect) {
                        handle.setIsOpen(!handle.isOpen);
                    }
                    flag = true;
                    break;

                case 'ArrowDown':
                    if (nav?.hasNavigableItems) {
                        if (handle.isOpen && !altKey) {
                            if (nav.hasActiveItem) {
                                if (nav.type === 'grid') {
                                    nav.goDown();
                                } else if (!nav.goToOffset(1) && wrapNavigation) {
                                    nav.goToFirst();
                                }
                            } else {
                                goToSelectedOrFirst(nav);
                            }
                        } else {
                            // Open the listbox and focus selected option, fall back to first.
                            handle.setIsOpen(true);
                            if (!altKey) goToSelectedOrFirst(nav);
                        }
                    }
                    flag = true;
                    break;

                case 'ArrowUp':
                    if (nav?.hasNavigableItems) {
                        if (!handle.isOpen && !altKey) {
                            // Open the listbox and focus selected option, fall back to last.
                            handle.setIsOpen(true);
                            goToSelectedOrLast(nav);
                        } else if (handle.isOpen && nav.hasActiveItem) {
                            if (nav.type === 'grid') {
                                nav.goUp();
                            } else if (!nav.goToOffset(-1) && wrapNavigation) {
                                nav.goToLast();
                            }
                        } else if (handle.isOpen && !nav.hasActiveItem && !altKey) {
                            goToSelectedOrLast(nav);
                        }
                    }
                    flag = true;
                    break;

                case 'Escape':
                    // 2-tier: close if open, otherwise clear value.
                    if (handle.isOpen) {
                        handle.setIsOpen(false);
                    } else {
                        handle.select(null);
                    }
                    flag = true;
                    break;

                case 'Tab':
                    // Select the active option (if any) and close. Let Tab propagate.
                    if (nav?.hasActiveItem && nav.activeItem && !isOptionDisabled(nav.activeItem)) {
                        handle.select(nav.activeItem);
                    }
                    handle.setIsOpen(false);
                    break;

                case 'PageUp':
                    if (handle.isOpen && nav?.hasActiveItem) {
                        nav.goToOffset(-10);
                    }
                    flag = true;
                    break;

                case 'PageDown':
                    if (handle.isOpen && nav?.hasActiveItem) {
                        nav.goToOffset(10);
                    }
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
        if (!abortController) {
            abortController = new AbortController();
        }

        // Initialize ARIA on trigger
        if (!trigger.getAttribute('aria-activedescendant')) {
            trigger.setAttribute('aria-activedescendant', '');
        }
        trigger.setAttribute('aria-expanded', String(isOpenState));

        // On first attach, wire up the mode-specific controller and shared keydown handler.
        if (isNewController) {
            const onKeydown = onTriggerAttach?.(handle, abortController.signal) || undefined;
            attachTriggerKeydown(trigger, abortController.signal, onKeydown);
        }

        if (listbox && !focusNav) {
            focusNav = setupListbox(handle, abortController.signal, notify);
        }
    }

    handle = {
        get trigger() {
            return trigger;
        },
        get listbox() {
            return listbox;
        },
        get focusNav() {
            return focusNav;
        },
        get isOpen() {
            return isOpenState;
        },
        get isMultiSelect() {
            return listbox?.getAttribute('aria-multiselectable') === 'true';
        },
        get isLoading() {
            return skeletonCount > 0;
        },

        setIsOpen(isOpen: boolean) {
            if (isOpenState === isOpen) return;
            isOpenState = isOpen;
            if (!isOpen) {
                focusNav?.clear();
            }

            // Update aria-expanded on trigger
            trigger?.setAttribute('aria-expanded', String(isOpen));
            notify('open', isOpen);
        },

        select(option: HTMLElement | null) {
            callbacks.onSelect({ value: option ? getOptionValue(option) : '' });
        },

        registerOption(element: HTMLElement, callback: (isFiltered: boolean) => void): () => void {
            const filterLower = filterValue.toLowerCase();
            const text = getOptionValue(element).toLowerCase();
            const isFiltered = filterLower.length > 0 && !text.startsWith(filterLower);
            optionRegistrations.set(element, { callback, lastFiltered: isFiltered });
            // Notify immediately with current state so the option renders correctly.
            callback(isFiltered);
            notifyVisibilityChange();
            return () => {
                optionRegistrations.delete(element);
                notifyVisibilityChange();
            };
        },

        setFilter(newFilter: string) {
            filterValue = newFilter;
            const filterLower = newFilter.toLowerCase();
            for (const [element, reg] of optionRegistrations) {
                const text = getOptionValue(element).toLowerCase();
                const isFiltered = filterLower.length > 0 && !text.startsWith(filterLower);
                // Only notify when state actually changes to avoid unnecessary re-renders.
                if (isFiltered !== reg.lastFiltered) {
                    reg.lastFiltered = isFiltered;
                    reg.callback(isFiltered);
                }
            }
            notifyVisibilityChange();
        },

        registerSection(
            element: HTMLElement,
            callback: (state: { hidden: boolean; 'aria-hidden': boolean }) => void,
        ): () => void {
            sectionRegistrations.set(element, { callback, last: { hidden: false, 'aria-hidden': false } });
            // Compute and notify initial state immediately (force to ensure callback fires).
            notifySection(element, sectionRegistrations, optionRegistrations, true);
            return () => {
                sectionRegistrations.delete(element);
            };
        },

        registerSkeleton(): () => void {
            const wasLoading = skeletonCount > 0;
            skeletonCount += 1;
            if (!wasLoading) {
                onSkeletonCountChange();
            }
            return () => {
                skeletonCount -= 1;
                if (skeletonCount === 0) {
                    onSkeletonCountChange();
                }
            };
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

        registerListbox(newListbox: HTMLElement): () => void {
            // If we already have the same listbox, nothing to do
            if (listbox === newListbox) return () => {};

            // Store the listbox. If trigger is already attached, we need to
            // create focus nav and attach listbox listeners.
            const hadListbox = !!listbox;
            listbox = newListbox;

            if (trigger && abortController) {
                if (!hadListbox) {
                    // First listbox — set up focus nav and listbox listeners
                    focusNav = setupListbox(handle, abortController.signal, notify);
                } else {
                    // Replacing listbox — full re-attach
                    detach();
                    tryAttach();
                }
            }

            return () => {
                if (listbox === newListbox) {
                    listbox = null;
                    focusNav = null;
                    // Don't full detach — trigger and mode controller stay alive
                    // The listbox may reappear (e.g., popover re-render)
                }
            };
        },

        subscribe<K extends keyof ComboboxEventMap>(
            event: K,
            callback: (value: ComboboxEventMap[K]) => void,
        ): () => void {
            subscribers[event].add(callback);
            return () => {
                subscribers[event].delete(callback);
            };
        },

        destroy() {
            detach();
            trigger = null;
            listbox = null;
            filterValue = '';
            lastIsEmpty = true;
            optionRegistrations.clear();
            sectionRegistrations.clear();
            skeletonCount = 0;
            clearTimeout(loadingTimer);
            // Clear all subscribers
            for (const set of Object.values(subscribers)) {
                set.clear();
            }
        },
    };

    return handle;
}
