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

    /** Last notified visible option count, to avoid redundant `optionsChange` notifications. */
    let lastOptionsLength = 0;

    /** Last notified input value, to re-fire `optionsChange` when the user keeps typing while empty. */
    let lastInputValue = '';

    /** Event subscribers managed by the handle. */
    const subscribers: { [K in keyof ComboboxEventMap]: Set<(value: ComboboxEventMap[K]) => void> } = {
        open: new Set(),
        activeDescendantChange: new Set(),
        optionsChange: new Set(),
        loadingChange: new Set(),
        loadingAnnouncement: new Set(),
    };

    /** Notify all subscribers for a given event. */
    function notify<K extends keyof ComboboxEventMap>(event: K, value: ComboboxEventMap[K]) {
        subscribers[event].forEach((cb) => cb(value));
    }

    /**
     * Notify all registered sections and fire `optionsChange` if the visible option count changed
     * or if the input value changed while the list is empty (so `emptyMessage` callbacks get
     * the updated query string).
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
        const inputValue = trigger?.value ?? '';
        const isEmpty = visibleCount === 0;
        if (visibleCount !== lastOptionsLength || (isEmpty && inputValue !== lastInputValue)) {
            lastOptionsLength = visibleCount;
            lastInputValue = inputValue;
            notify('optionsChange', { optionsLength: visibleCount, inputValue });
        }
    }

    // ── Skeleton loading tracking ──────────────────────────────

    /** Delay before announcing loading in the live region (ms). */
    const LOADING_ANNOUNCEMENT_DELAY = 500;

    /** Number of currently mounted skeleton placeholders. */
    let skeletonCount = 0;

    /** Timer for debounced loading announcement. */
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;

    /** Whether a loading announcement has been sent since the last open. */
    let announcementSent = false;

    /** Start or restart the debounced loading announcement timer if conditions are met. */
    function startLoadingAnnouncementTimer() {
        clearTimeout(loadingTimer);
        if (skeletonCount > 0 && isOpenState) {
            loadingTimer = setTimeout(() => {
                if (skeletonCount > 0 && isOpenState) {
                    announcementSent = true;
                    notify('loadingAnnouncement', true);
                }
            }, LOADING_ANNOUNCEMENT_DELAY);
        }
    }

    /**
     * Called when the skeleton count transitions between 0 and >0 (or vice versa).
     * Fires `loadingChange` immediately and manages the debounced `loadingAnnouncement`.
     */
    function onSkeletonCountChange() {
        const isLoading = skeletonCount > 0;
        notify('loadingChange', isLoading);

        if (isLoading) {
            startLoadingAnnouncementTimer();
        } else {
            clearTimeout(loadingTimer);
            if (announcementSent) {
                announcementSent = false;
                notify('loadingAnnouncement', false);
            }
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
     * Handles: Enter, ArrowDown, ArrowUp, Escape (2-tier), PageUp, PageDown.
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
                        // Capture activeItem before click — the click handler may close
                        // the popover and clear the focus navigation state.
                        const { activeItem } = nav;
                        // "Click" on active option
                        if (!isOptionDisabled(activeItem)) {
                            activeItem.click();
                        }
                        // Only close when not in multi select and not in action cell
                        if (!handle.isMultiSelect && !isActionCell(activeItem)) {
                            handle.setIsOpen(false);
                        }
                    } else if (!handle.isMultiSelect) {
                        // No active item — toggle open/close.
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
                // Reset announcement state so it retriggers on next open
                clearTimeout(loadingTimer);
                if (announcementSent) {
                    announcementSent = false;
                    notify('loadingAnnouncement', false);
                }
            } else if (skeletonCount > 0) {
                // Opening while already loading — start the announcement timer
                startLoadingAnnouncementTimer();
            }

            // Update aria-expanded on trigger
            trigger?.setAttribute('aria-expanded', String(isOpen));
            notify('open', isOpen);

            // When opening, always notify the current options state so that
            // subscribers (ComboboxState) get the correct initial value.
            // Without this, a list that starts empty never fires `optionsChange`
            // because `lastOptionsLength` is initialized to `0` and `notifyVisibilityChange`
            // only fires on *changes*.
            if (isOpen) {
                const inputValue = trigger?.value ?? '';
                notify('optionsChange', { optionsLength: lastOptionsLength, inputValue });
            }
        },

        select(option: HTMLElement | null) {
            callbacks.onSelect({ value: option ? getOptionValue(option) : '' }, handle);
        },

        registerOption(element: HTMLElement, callback: (isFiltered: boolean) => void): () => void {
            const filterLower = filterValue.toLowerCase();
            const text = getOptionValue(element).toLowerCase();
            const isFiltered = filterLower.length > 0 && !text.includes(filterLower);
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
                const isFiltered = filterLower.length > 0 && !text.includes(filterLower);
                // Only notify when state actually changes to avoid unnecessary re-renders.
                if (isFiltered !== reg.lastFiltered) {
                    reg.lastFiltered = isFiltered;
                    reg.callback(isFiltered);
                }
            }
            notifyVisibilityChange();
        },

        refilterOption(element: HTMLElement) {
            const reg = optionRegistrations.get(element);
            if (!reg) return;
            const filterLower = filterValue.toLowerCase();
            const text = getOptionValue(element).toLowerCase();
            const isFiltered = filterLower.length > 0 && !text.includes(filterLower);
            if (isFiltered !== reg.lastFiltered) {
                reg.lastFiltered = isFiltered;
                reg.callback(isFiltered);
                notifyVisibilityChange();
            }
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
            lastOptionsLength = 0;
            lastInputValue = '';
            optionRegistrations.clear();
            sectionRegistrations.clear();
            skeletonCount = 0;
            clearTimeout(loadingTimer);
            announcementSent = false;
            // Clear all subscribers
            for (const set of Object.values(subscribers)) {
                set.clear();
            }
        },
    };

    return handle;
}
