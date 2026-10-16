import { createTypeahead, type Typeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';
import { getOptionLabel, getOptionValue, isOptionDisabled, isSelected } from './utils';
import { isOptionActiveEvent, OPTION_ACTIVE_EVENT_PREFIX, optionActiveEvent } from './constants';
import type {
    CompositeEventMap,
    CompositeFilterMode,
    CompositeHandle,
    CompositeNavigation,
    CompositeOptions,
    CompositeSpecialization,
    CompositeType,
    OptionActiveEvent,
} from './types';

/** Delay before announcing loading in the live region (ms). */
const LOADING_ANNOUNCEMENT_DELAY = 500;

/** Result of {@link setupComposite}: the handle, and the hooks the specialization calls. */
export interface CompositeSetup<T extends CompositeType> {
    /** The composite handle (the specialization adds its own methods to it). */
    handle: CompositeHandle<T>;
    /**
     * Fire `optionsChange` when the visible count (or the hidden count state) changed, or when the
     * input value changed while empty. The specialization calls it when its items change.
     */
    notifyOptionsChange(): void;
}

/**
 * Set up the behavior shared by the composite widgets (one active item among many: WAI-ARIA listbox,
 * grid, …) independent of any DOM element.
 *
 * The composite owns the focus owner link, the focus navigation (once an element is mounted, with the
 * navigation module of the specialization), the keyboard handling, the selection, the open state, the
 * skeleton registry, the loading announcement and the events. The specialization owns its item
 * registry, its filter and its navigation modules (see {@link CompositeSpecialization}).
 *
 * - Standalone (no `focusOwner` option): the composite element owns DOM focus and
 *   `aria-activedescendant`, and handles its own keyboard navigation.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard;
 *   the composite writes `aria-activedescendant` on the parent focus owner.
 */
export function setupComposite<T extends CompositeType>(
    options: CompositeOptions,
    specialization: CompositeSpecialization<T>,
): CompositeSetup<T> {
    const { onSelect, wrapNavigation = false, focusOwner: link } = options;
    const isStandalone = !link;

    let element: HTMLElement | null = null;
    let navigation: CompositeNavigation<T> | null = null;
    /** AbortController for the listeners attached on mount. */
    let mountController: AbortController | null = null;
    /** Typeahead controller (created on mount, needs the composite element). */
    let typeaheadController: Typeahead | null = null;

    let lastOptionsLength = 0;
    let lastInputValue = '';
    let lastCountHidden = false;
    let lastLoadingState = false;
    /** Skeletons at the root of the composite (they make it busy). */
    let skeletonCount = 0;
    /** Skeletons inside a nested level of items (they only start the loading announcement). */
    let nestedSkeletonCount = 0;

    /** Whether the items are visible (standalone: always; combobox: set by the combobox open state). */
    let isOpen = isStandalone;
    /** Timer for the debounced loading announcement. */
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;
    /** Whether a loading announcement has been sent since the items became visible. */
    let announcementSent = false;

    /** Static events (per-item active events are handled separately). */
    type StaticEvent = 'activeDescendantChange' | 'optionsChange' | 'loadingChange' | 'loadingAnnouncement' | 'open';
    const subscribers: { [K in StaticEvent]: Set<(value: CompositeEventMap[K]) => void> } = {
        activeDescendantChange: new Set(),
        optionsChange: new Set(),
        loadingChange: new Set(),
        loadingAnnouncement: new Set(),
        open: new Set(),
    };
    // `open` has a value from creation so pull-based subscribers read it before any change.
    const latestValues: { [K in StaticEvent]?: CompositeEventMap[K] } = { open: isOpen };

    /** Per-item subscribers, keyed by optionActive:<id>. Sets are created on demand. */
    const optionActiveSubscribers = new Map<OptionActiveEvent, Set<(isActive: boolean) => void>>();

    function notify<K extends StaticEvent>(event: K, value: CompositeEventMap[K]) {
        const previous = latestValues.activeDescendantChange ?? null;

        latestValues[event] = value;
        const eventSubscribers = subscribers[event] as Set<(v: CompositeEventMap[K]) => void>;
        for (const cb of eventSubscribers) cb(value);

        // Fan out to the 2 affected items only: first the previous one, then the new one.
        if (event === 'activeDescendantChange' && previous !== value) {
            if (previous) optionActiveSubscribers.get(optionActiveEvent(previous))?.forEach((cb) => cb(false));
            if (value) optionActiveSubscribers.get(optionActiveEvent(value as string))?.forEach((cb) => cb(true));
        }
    }

    // Forward-declared so the DOM listeners can reference `handle` (via closure) before it is constructed.
    let handle!: CompositeHandle<T>;

    /** The element that holds DOM focus and `aria-activedescendant`. */
    const getFocusOwner = (): HTMLElement | null => (link ? link.getFocusOwner() : element);

    function notifyOptionsChange() {
        const visibleCount = specialization.getVisibleCount();
        const isCountHidden = specialization.isCountHidden?.() ?? false;
        const inputValue = link?.getInputValue?.() ?? '';
        const isEmpty = visibleCount === 0;
        if (
            visibleCount !== lastOptionsLength ||
            isCountHidden !== lastCountHidden ||
            (isEmpty && inputValue !== lastInputValue)
        ) {
            lastOptionsLength = visibleCount;
            lastInputValue = inputValue;
            lastCountHidden = isCountHidden;
            notify('optionsChange', { optionsLength: visibleCount, inputValue, isCountHidden });
        }
    }

    // ── Loading announcement ──────────────────────────────────

    /** Whether any skeleton is registered (at the root or in a nested level). */
    const hasSkeleton = () => skeletonCount + nestedSkeletonCount > 0;

    /** Start or restart the debounced loading announcement timer if conditions are met. */
    function startLoadingAnnouncementTimer() {
        clearTimeout(loadingTimer);
        if (hasSkeleton() && isOpen) {
            loadingTimer = setTimeout(() => {
                if (hasSkeleton() && isOpen) {
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

    /**
     * Called when a skeleton is registered or unregistered: `loadingChange` follows the root skeletons
     * only; the loading announcement follows every skeleton.
     */
    function onSkeletonCountChange(wasLoading: boolean, hadSkeleton: boolean) {
        const isLoading = skeletonCount > 0;
        if (isLoading !== wasLoading) {
            lastLoadingState = isLoading;
            notify('loadingChange', isLoading);
        }
        if (hasSkeleton() === hadSkeleton) return;
        if (hadSkeleton) resetLoadingAnnouncement();
        else startLoadingAnnouncementTimer();
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
        const container = newElement;

        /**
         * Standalone only: true after a pointer press on the composite, until the next key press or blur.
         * In pointer mode, the active item is kept (`aria-activedescendant`) but the focus ring is hidden,
         * so that the ring only shows for keyboard interaction.
         */
        let isPointerModality = false;

        // The specialization selects the navigation module (pattern) from the element.
        const nav = specialization.createNavigation(container, {
            container,
            wrap: wrapNavigation,
            signal,
            getActiveItem: () => {
                const id = getFocusOwner()?.getAttribute('aria-activedescendant');
                return (id && container.querySelector<HTMLElement>(`#${CSS.escape(id)}`)) || null;
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
        link?.onMount?.(container);
        /** The cell of a pressed or clicked element (see {@link CompositeNavigation.getCellFromTarget}). */
        const getCell = (target: HTMLElement): HTMLElement | null =>
            nav.getCellFromTarget ? nav.getCellFromTarget(target) : target.closest<HTMLElement>(cellSelector);

        typeaheadController = createTypeahead(
            () => createSelectorTreeWalker(container, cellSelector),
            getOptionLabel,
            signal,
        );

        // ── Delegated listeners ───────────────────────────────

        container.addEventListener(
            'click',
            (event) => {
                const cell = getCell(event.target as HTMLElement);
                if (!cell) return;
                // Do not select disabled cells.
                if (isOptionDisabled(cell)) {
                    event.stopPropagation();
                    return;
                }
                // Not an option cell (e.g. grid action cell, non-selectable tree item): skip the selection,
                // let its own handler fire.
                if (nav.isOptionCell(cell)) {
                    handle.select(cell);
                    getFocusOwner()?.focus();
                }
                // Standalone: the clicked item becomes the active item (also a non-option cell, e.g. a grid
                // action cell).
                if (isStandalone) focusNav.goTo(() => cell);
            },
            { signal },
        );

        /** Elements whose mousedown must not move DOM focus (the cells, and the extra elements of the pattern). */
        const pressSelector = nav.keepFocusSelector ? `${cellSelector}, ${nav.keepFocusSelector}` : cellSelector;
        /** Standalone only: true while the composite takes focus from a press on a cell (see mousedown). */
        let isFocusFromPress = false;

        // Prevent mousedown on cells to avoid moving focus away from the focus owner before click fires.
        container.addEventListener(
            'mousedown',
            (event) => {
                // Standalone: pointer interaction hides the focus ring (until the next key press).
                if (isStandalone) isPointerModality = true;
                const target = event.target as HTMLElement;
                if (!target.closest(pressSelector)) return;
                event.preventDefault();
                // Standalone: the composite takes the focus that the pressed element does not take (not on a
                // disabled cell: its click does nothing). The click sets the active item.
                const cell = getCell(target);
                if (isStandalone && document.activeElement !== container && !(cell && isOptionDisabled(cell))) {
                    isFocusFromPress = true;
                    container.focus();
                    isFocusFromPress = false;
                }
            },
            { signal },
        );

        specialization.onMount?.(container, nav, signal);

        // ── Standalone focus owner listeners ──────────────────
        if (isStandalone) {
            container.addEventListener(
                'keydown',
                (event) => {
                    // Keyboard interaction: show the focus ring on the active item.
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
            // On focus: show the visual focus on the selected item, or else on the first item.
            // Not on a focus from a press on a cell: the click sets the active item.
            container.addEventListener(
                'focus',
                () => {
                    if (!focusNav.selectors.activeItem && !isFocusFromPress) {
                        focusNav.goTo((s) => s.getMatching(isSelected) ?? s.getFirst());
                    }
                },
                { signal },
            );
            // On blur: hide the visual focus and reset the interaction mode (a later Tab shows the ring).
            container.addEventListener(
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
            return specialization.getVisibleCount() > 0 || hasSkeleton();
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
            if (!navigation || !nav) return false;
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
                    // Delegated to the navigation module (e.g. grid: move between cells).
                    return navigation.handleHorizontalKey
                        ? navigation.handleHorizontalKey(event.key)
                        : navigation.navigateHorizontal(event.key);
                case 'Home':
                    nav.goTo((s) => s.getFirst());
                    return true;
                case 'End':
                    nav.goTo((s) => s.getLast());
                    return true;
                case 'PageUp':
                    // Without an active item, let the page scroll.
                    if (!activeItem) return false;
                    nav.goToOffset(-10);
                    return true;
                case 'PageDown':
                    if (!activeItem) return false;
                    nav.goToOffset(10);
                    return true;
                case 'Enter':
                case ' ':
                    // Select (single) or toggle (multi) the active item. Without an active item the key
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

        setFilter(filterValue: string, mode: CompositeFilterMode = 'auto') {
            specialization.setFilter(filterValue, mode);
            notifyOptionsChange();
        },

        registerSkeleton({ isNested = false } = {}) {
            const update = (delta: number) => {
                const wasLoading = skeletonCount > 0;
                const hadSkeleton = hasSkeleton();
                if (isNested) nestedSkeletonCount += delta;
                else skeletonCount += delta;
                onSkeletonCountChange(wasLoading, hadSkeleton);
            };
            update(1);
            return () => update(-1);
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
                    event.slice(OPTION_ACTIVE_EVENT_PREFIX.length)) as CompositeEventMap[typeof event];
            }
            return latestValues[event as StaticEvent] as CompositeEventMap[typeof event];
        },

        destroy() {
            unmount();
            clearTimeout(loadingTimer);
            announcementSent = false;
            lastOptionsLength = 0;
            lastInputValue = '';
            lastCountHidden = false;
            lastLoadingState = false;
            for (const key of Object.keys(latestValues) as Array<keyof typeof latestValues>) {
                delete latestValues[key];
            }
            isOpen = isStandalone;
            latestValues.open = isOpen;
            skeletonCount = 0;
            nestedSkeletonCount = 0;
            specialization.destroy?.();
            optionActiveSubscribers.clear();
            for (const set of Object.values(subscribers)) set.clear();
        },
    };

    return { handle, notifyOptionsChange };
}
