import { createTypeahead, type Typeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';
import { getOptionLabel, getOptionValue, isOptionDisabled, isSelected, notifySection } from './utils';
import { isOptionActiveEvent, OPTION_ACTIVE_EVENT_PREFIX, optionActiveEvent } from './constants';
import { createGridNavigation, createListNavigation, type ListboxNavigation } from './navigation';
import type {
    ListboxEventMap,
    OptionActiveEvent,
    ListboxHandle,
    ListboxOptions,
    OptionRegistration,
    SectionRegistration,
    SectionState,
} from './types';

/** Delay before announcing loading in the live region (ms). */
const LOADING_ANNOUNCEMENT_DELAY = 500;

/**
 * Set up listbox behavior (WAI-ARIA listbox or grid pattern) independent of any DOM element.
 *
 * The handle owns the option/section/skeleton registry, the filter state, the focus navigation
 * (once an element is mounted), the selection, the loading announcement and the listbox events.
 * The navigation module (listbox or grid pattern) is selected from the element role on mount.
 *
 * - Standalone (no `focusOwner` option): the listbox element owns DOM focus and
 *   `aria-activedescendant`, and handles its own keyboard navigation.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard;
 *   the listbox writes `aria-activedescendant` on the parent focus owner.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
export function setupListbox(options: ListboxOptions = {}): ListboxHandle {
    const { onSelect, wrapNavigation = false, focusOwner: link } = options;
    const isStandalone = !link;

    let element: HTMLElement | null = null;
    let navigation: ListboxNavigation | null = null;
    /** AbortController for the listeners attached on mount. */
    let mountController: AbortController | null = null;
    /** Typeahead controller (created on mount, needs the listbox element). */
    let typeaheadController: Typeahead | null = null;

    /** Current filter value (empty string = no filtering). */
    let filterValue = '';
    const optionRegistrations = new Map<HTMLElement, OptionRegistration>();
    const sectionRegistrations = new Map<HTMLElement, SectionRegistration>();
    let lastOptionsLength = 0;
    let lastInputValue = '';
    let lastLoadingState = false;
    let skeletonCount = 0;

    /** Whether the options are visible (standalone: always; combobox: set by the combobox open state). */
    let isOpen = isStandalone;
    /** Timer for the debounced loading announcement. */
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;
    /** Whether a loading announcement has been sent since the options became visible. */
    let announcementSent = false;

    /** Static listbox events (per-option active events are handled separately). */
    type StaticEvent = 'activeDescendantChange' | 'optionsChange' | 'loadingChange' | 'loadingAnnouncement' | 'open';
    const subscribers: { [K in StaticEvent]: Set<(value: ListboxEventMap[K]) => void> } = {
        activeDescendantChange: new Set(),
        optionsChange: new Set(),
        loadingChange: new Set(),
        loadingAnnouncement: new Set(),
        open: new Set(),
    };
    // `open` has a value from creation so pull-based subscribers read it before any change.
    const latestValues: { [K in StaticEvent]?: ListboxEventMap[K] } = { open: isOpen };

    /** Per-option subscribers, keyed by optionActive:<id>. Sets are created on demand. */
    const optionActiveSubscribers = new Map<OptionActiveEvent, Set<(isActive: boolean) => void>>();

    function notify<K extends StaticEvent>(event: K, value: ListboxEventMap[K]) {
        const previous = latestValues.activeDescendantChange ?? null;

        latestValues[event] = value;
        const eventSubscribers = subscribers[event] as Set<(v: ListboxEventMap[K]) => void>;
        for (const cb of eventSubscribers) cb(value);

        // Fan out to the 2 affected options only: first the previous one, then the new one.
        if (event === 'activeDescendantChange' && previous !== value) {
            if (previous) optionActiveSubscribers.get(optionActiveEvent(previous))?.forEach((cb) => cb(false));
            if (value) optionActiveSubscribers.get(optionActiveEvent(value as string))?.forEach((cb) => cb(true));
        }
    }

    // Forward-declared so the DOM listeners can reference `handle` (via closure) before it is constructed.
    let handle!: ListboxHandle;

    /** The element that holds DOM focus and `aria-activedescendant`. */
    const getFocusOwner = (): HTMLElement | null => (link ? link.getFocusOwner() : element);

    function getVisibleOptionCount(): number {
        let count = 0;
        for (const reg of optionRegistrations.values()) {
            if (!reg.lastFiltered) count += 1;
        }
        return count;
    }

    function isFilteredOut(option: HTMLElement): boolean {
        const filterLower = filterValue.toLowerCase();
        return filterLower.length > 0 && !getOptionValue(option).toLowerCase().includes(filterLower);
    }

    /**
     * Notify sections, then fire `optionsChange` when the visible count changed (or when the input
     * value changed while empty).
     */
    function notifyVisibilityChange() {
        for (const [sectionElement] of sectionRegistrations) {
            notifySection(sectionElement, sectionRegistrations, optionRegistrations);
        }
        const visibleCount = getVisibleOptionCount();
        const inputValue = link?.getInputValue?.() ?? '';
        const isEmpty = visibleCount === 0;
        if (visibleCount !== lastOptionsLength || (isEmpty && inputValue !== lastInputValue)) {
            lastOptionsLength = visibleCount;
            lastInputValue = inputValue;
            notify('optionsChange', { optionsLength: visibleCount, inputValue });
        }
    }

    // ── Loading announcement ──────────────────────────────────

    /** Start or restart the debounced loading announcement timer if conditions are met. */
    function startLoadingAnnouncementTimer() {
        clearTimeout(loadingTimer);
        if (skeletonCount > 0 && isOpen) {
            loadingTimer = setTimeout(() => {
                if (skeletonCount > 0 && isOpen) {
                    announcementSent = true;
                    notify('loadingAnnouncement', true);
                }
            }, LOADING_ANNOUNCEMENT_DELAY);
        }
    }

    /** Cancel the pending loading announcement and retract the sent one. */
    function resetLoadingAnnouncement() {
        clearTimeout(loadingTimer);
        if (announcementSent) {
            announcementSent = false;
            notify('loadingAnnouncement', false);
        }
    }

    /** Called when the skeleton count transitions between 0 and >0 (or vice versa). */
    function onSkeletonCountChange() {
        const isLoading = skeletonCount > 0;
        lastLoadingState = isLoading;
        notify('loadingChange', isLoading);
        if (isLoading) startLoadingAnnouncementTimer();
        else resetLoadingAnnouncement();
    }

    // ── Mount (DOM) ───────────────────────────────────────────

    function unmount() {
        mountController?.abort();
        mountController = null;
        navigation = null;
        typeaheadController = null;
        element = null;
    }

    function mount(newElement: HTMLElement): () => void {
        if (element === newElement) return () => {};
        unmount();
        element = newElement;
        mountController = new AbortController();
        const { signal } = mountController;
        const listbox = newElement;

        /**
         * Standalone only: true after a pointer press on the list, until the next key press or blur.
         * In pointer mode, the active option is kept (`aria-activedescendant`) but the focus ring is hidden,
         * so that the ring only shows for keyboard interaction.
         */
        let isPointerModality = false;

        // Select the navigation module (listbox or grid pattern) from the element role.
        const createNavigation = listbox.getAttribute('role') === 'grid' ? createGridNavigation : createListNavigation;
        const nav: ListboxNavigation = createNavigation({
            container: listbox,
            wrap: wrapNavigation,
            signal,
            getActiveItem: () => {
                const id = getFocusOwner()?.getAttribute('aria-activedescendant');
                return (id && listbox.querySelector<HTMLElement>(`#${CSS.escape(id)}`)) || null;
            },
            callbacks: {
                onActivate(item) {
                    if (!isPointerModality) item.setAttribute('data-focus-visible-added', 'true');
                    getFocusOwner()?.setAttribute('aria-activedescendant', item.id);
                    notify('activeDescendantChange', item.id);
                    requestAnimationFrame(() => nav.scrollIntoView(item));
                },
                onDeactivate(item) {
                    item.removeAttribute('data-focus-visible-added');
                },
                onClear() {
                    getFocusOwner()?.setAttribute('aria-activedescendant', '');
                    notify('activeDescendantChange', null);
                },
            },
        });
        navigation = nav;
        const { focusNav, cellSelector } = nav;
        link?.onMount?.(listbox);

        typeaheadController = createTypeahead(
            () => createSelectorTreeWalker(listbox, cellSelector),
            getOptionLabel,
            signal,
        );

        // ── Delegated listbox listeners ───────────────────────

        listbox.addEventListener(
            'click',
            (event) => {
                const cell = (event.target as HTMLElement).closest(cellSelector) as HTMLElement | null;
                if (!cell) return;
                // Do not select disabled cells.
                if (isOptionDisabled(cell)) {
                    event.stopPropagation();
                    return;
                }
                // Action cell — skip option selection, let its own handler fire.
                if (!nav.isOptionCell(cell)) return;

                handle.select(cell);
                getFocusOwner()?.focus();
                // Standalone: the clicked option becomes the active option.
                if (isStandalone) focusNav.goTo(() => cell);
            },
            { signal },
        );

        // Prevent mousedown on cells to avoid moving focus away from the focus owner before click fires.
        listbox.addEventListener(
            'mousedown',
            (event) => {
                // Standalone: pointer interaction hides the focus ring (until the next key press).
                if (isStandalone) isPointerModality = true;
                if ((event.target as HTMLElement).closest(cellSelector)) event.preventDefault();
            },
            { signal },
        );

        // ── Standalone focus owner listeners ──────────────────
        if (isStandalone) {
            listbox.addEventListener(
                'keydown',
                (event) => {
                    // Keyboard interaction: show the focus ring on the active option.
                    if (isPointerModality) {
                        isPointerModality = false;
                        focusNav.selectors.activeItem?.setAttribute('data-focus-visible-added', 'true');
                    }
                    if (handle.handleKeydown(event)) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                },
                { signal },
            );
            // On focus: show the visual focus on the selected option, or else on the first option.
            listbox.addEventListener(
                'focus',
                () => {
                    if (!focusNav.selectors.activeItem) {
                        focusNav.goTo((s) => s.getMatching(isSelected) ?? s.getFirst());
                    }
                },
                { signal },
            );
            // On blur: hide the visual focus and reset the interaction mode (a later Tab shows the ring).
            listbox.addEventListener(
                'focusout',
                () => {
                    focusNav.clear();
                    isPointerModality = false;
                },
                { signal },
            );
        }

        return () => {
            if (element === newElement) unmount();
        };
    }

    handle = {
        get element() {
            return element;
        },
        get type() {
            return navigation?.type ?? null;
        },
        get focusNav() {
            return navigation?.focusNav ?? null;
        },
        get isStandalone() {
            return isStandalone;
        },
        get isOpen() {
            return isOpen;
        },
        get isMultiSelect() {
            return element?.getAttribute('aria-multiselectable') === 'true';
        },
        get isLoading() {
            return skeletonCount > 0;
        },
        get hasVisibleContent() {
            return getVisibleOptionCount() > 0 || skeletonCount > 0;
        },

        mount,

        setOpen(open: boolean) {
            if (isOpen === open) return;
            isOpen = open;
            if (open) startLoadingAnnouncementTimer();
            else resetLoadingAnnouncement();
            notify('open', open);
        },

        select(option: HTMLElement | null) {
            onSelect?.({ value: option ? getOptionValue(option) : '' }, option);
        },

        navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean {
            return navigation?.navigateHorizontal(key) ?? false;
        },

        handleKeydown(event: KeyboardEvent): boolean {
            const nav = navigation?.focusNav;
            if (!nav) return false;
            const { activeItem, hasNavigableItems } = nav.selectors;
            switch (event.key) {
                // Arrows: consume the key even without navigable items (nothing to move to, no pending intent).
                case 'ArrowDown':
                    if (activeItem) nav.goDown();
                    else if (hasNavigableItems) nav.goTo((s) => s.getMatching(isSelected) ?? s.getFirst());
                    return true;
                case 'ArrowUp':
                    if (activeItem) nav.goUp();
                    else if (hasNavigableItems) nav.goTo((s) => s.getMatching(isSelected) ?? s.getLast());
                    return true;
                case 'ArrowLeft':
                case 'ArrowRight':
                    // Grid: move between cells (consume the key even without an active cell).
                    if (navigation?.type !== 'grid') return false;
                    handle.navigateHorizontal(event.key);
                    return true;
                case 'Home':
                    nav.goTo((s) => s.getFirst());
                    return true;
                case 'End':
                    nav.goTo((s) => s.getLast());
                    return true;
                case 'PageUp':
                    // Without an active option, let the page scroll.
                    if (!activeItem) return false;
                    nav.goToOffset(-10);
                    return true;
                case 'PageDown':
                    if (!activeItem) return false;
                    nav.goToOffset(10);
                    return true;
                case 'Enter':
                case ' ':
                    // Select (single) or toggle (multi) the active option. Without an active option the key
                    // is not handled (a combobox lets Enter submit a surrounding form).
                    if (!activeItem) return false;
                    if (!isOptionDisabled(activeItem)) activeItem.click();
                    return true;
                default:
                    if (isPrintableKey(event)) {
                        const typeahead = typeaheadController;
                        if (!typeahead) return false;
                        typeahead.handle(event.key, activeItem);
                        nav.goTo((n) => typeahead.rematch(n.activeItem));
                        return true;
                    }
                    return false;
            }
        },

        flushPendingNavigation() {
            navigation?.focusNav.flushPendingNavigation();
        },

        registerOption(optionElement, callback) {
            const isFiltered = isFilteredOut(optionElement);
            optionRegistrations.set(optionElement, { callback, lastFiltered: isFiltered });
            // Notify immediately with current state so the option renders correctly.
            callback(isFiltered);
            notifyVisibilityChange();
            return () => {
                optionRegistrations.delete(optionElement);
                notifyVisibilityChange();
            };
        },

        setFilter(newFilter: string) {
            filterValue = newFilter;
            for (const [optionElement, reg] of optionRegistrations) {
                const isFiltered = isFilteredOut(optionElement);
                // Only notify when state actually changes to avoid unnecessary re-renders.
                if (isFiltered !== reg.lastFiltered) {
                    reg.lastFiltered = isFiltered;
                    reg.callback(isFiltered);
                }
            }
            notifyVisibilityChange();
        },

        refilterOption(optionElement) {
            const reg = optionRegistrations.get(optionElement);
            if (!reg) return;
            const isFiltered = isFilteredOut(optionElement);
            if (isFiltered !== reg.lastFiltered) {
                reg.lastFiltered = isFiltered;
                reg.callback(isFiltered);
                notifyVisibilityChange();
            }
        },

        registerSection(sectionElement, callback: (state: SectionState) => void) {
            sectionRegistrations.set(sectionElement, { callback, last: { hidden: false, 'aria-hidden': false } });
            // Compute and notify initial state immediately (force to ensure callback fires).
            notifySection(sectionElement, sectionRegistrations, optionRegistrations, true);
            return () => {
                sectionRegistrations.delete(sectionElement);
            };
        },

        registerSkeleton() {
            const wasLoading = skeletonCount > 0;
            skeletonCount += 1;
            if (!wasLoading) onSkeletonCountChange();
            return () => {
                skeletonCount -= 1;
                if (skeletonCount === 0) onSkeletonCountChange();
            };
        },

        subscribe(event, callback) {
            if (isOptionActiveEvent(event)) {
                const optionCallback = callback as (isActive: boolean) => void;
                const set = optionActiveSubscribers.get(event) ?? new Set();
                optionActiveSubscribers.set(event, set);
                set.add(optionCallback);
                // Replay (same as open): Vue subscribes after mount and can miss the activation.
                if (latestValues.activeDescendantChange === event.slice(OPTION_ACTIVE_EVENT_PREFIX.length)) {
                    optionCallback(true);
                }
                return () => {
                    set.delete(optionCallback);
                    if (!set.size) optionActiveSubscribers.delete(event);
                };
            }
            const staticEvent = event as StaticEvent;
            (subscribers[staticEvent] as Set<typeof callback>).add(callback);
            // Replay current loading/visible state to late subscribers (e.g. async Vue watchers).
            if ((event === 'loadingChange' && lastLoadingState) || (event === 'open' && isOpen)) {
                (callback as (value: boolean) => void)(true);
            }
            return () => {
                (subscribers[staticEvent] as Set<typeof callback>).delete(callback);
            };
        },

        getSnapshot(event) {
            if (isOptionActiveEvent(event)) {
                // Derived value. No per-id value is stored.
                return (latestValues.activeDescendantChange ===
                    event.slice(OPTION_ACTIVE_EVENT_PREFIX.length)) as ListboxEventMap[typeof event];
            }
            return latestValues[event as StaticEvent] as ListboxEventMap[typeof event];
        },

        destroy() {
            unmount();
            clearTimeout(loadingTimer);
            announcementSent = false;
            filterValue = '';
            lastOptionsLength = 0;
            lastInputValue = '';
            lastLoadingState = false;
            for (const key of Object.keys(latestValues) as Array<keyof typeof latestValues>) {
                delete latestValues[key];
            }
            isOpen = isStandalone;
            latestValues.open = isOpen;
            optionRegistrations.clear();
            sectionRegistrations.clear();
            skeletonCount = 0;
            optionActiveSubscribers.clear();
            for (const set of Object.values(subscribers)) set.clear();
        },
    };

    return handle;
}
