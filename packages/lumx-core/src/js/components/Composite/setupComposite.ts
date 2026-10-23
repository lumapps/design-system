import { createTypeahead, type Typeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';
import { getOptionLabel, getOptionValue, isOptionDisabled, isSelected } from './utils';
import { getOptionActiveId, isOptionActiveEvent, optionActiveEvent } from './constants';
import { CLASSNAME as STATUS_CLASSNAME } from './CompositeStatus';
import type {
    CompositeEventMap,
    CompositeFilter,
    CompositeFilterMode,
    CompositeHandle,
    CompositeNavigation,
    CompositeOptions,
    CompositeSpecialization,
} from './types';

/** Delay before announcing loading in the live region (ms). */
const LOADING_ANNOUNCEMENT_DELAY = 500;

/** The `optionsChange` payload before any item registers. */
const INITIAL_OPTIONS = { optionsLength: 0, inputValue: '', isCountHidden: false };

/** The filter before any `setFilter` (no filter). */
const NO_FILTER: CompositeFilter = { value: '', mode: 'auto' };

/** Result of {@link setupComposite}: the handle, and the hooks the specialization calls. */
export interface CompositeSetup {
    /** The composite handle (the specialization adds its own methods to it). */
    handle: CompositeHandle;
    /**
     * Fire `optionsChange` when the visible count (or the hidden count state) changed, or when the
     * input value changed while empty. The specialization calls it when its items change.
     */
    notifyOptionsChange(): void;
    /** The current filter (set with {@link CompositeHandle.setFilter}, reset on destroy). */
    getFilter(): CompositeFilter;
}

/** The DOM part of a composite, from `mount` to unmount. */
interface Mounted {
    element: HTMLElement;
    navigation: CompositeNavigation;
    typeahead: Typeahead;
    /** Aborts the listeners attached on mount. */
    controller: AbortController;
}

/** A subscriber callback (the payload type depends on the event). */
type Subscriber = (value: unknown) => void;

/**
 * Set up the behavior shared by the composite widgets (one active item among many: WAI-ARIA listbox,
 * grid, …) independent of any DOM element.
 *
 * The composite owns the focus owner link, the focus navigation (once an element is mounted, with the
 * navigation module of the specialization), the keyboard handling, the selection, the open state, the
 * filter, the skeleton registry, the loading announcement and the events. The specialization owns its item
 * registry, how it applies the filter and its navigation modules (see {@link CompositeSpecialization}).
 *
 * - Standalone (no `focusOwner` option): the composite element owns DOM focus and
 *   `aria-activedescendant`, and handles its own keyboard navigation.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard;
 *   the composite writes `aria-activedescendant` on the parent focus owner.
 */
export function setupComposite(options: CompositeOptions, specialization: CompositeSpecialization): CompositeSetup {
    const { onSelect, wrapNavigation = false, focusOwner: link } = options;
    const isStandalone = !link;

    /** The mounted element and what is created with it (null while not mounted). */
    let mounted: Mounted | null = null;

    /** The current filter (see {@link CompositeHandle.setFilter}). */
    let filter = NO_FILTER;
    /** The last `optionsChange` payload. */
    let lastOptions: Required<NonNullable<CompositeEventMap['optionsChange']>> = INITIAL_OPTIONS;
    /**
     * Registered skeletons, one token per registration: a stale cleanup (e.g. after a destroy) finds no
     * token and changes nothing. Root skeletons make the composite busy, nested ones (inside a nested
     * level of items) only start the loading announcement.
     */
    const rootSkeletons = new Set<object>();
    const nestedSkeletons = new Set<object>();

    /** Whether the items are visible (standalone: always; combobox: set by the combobox open state). */
    let isOpen = isStandalone;
    /** Timer for the debounced loading announcement. */
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;
    /** Whether a loading announcement has been sent since the items became visible. */
    let announcementSent = false;

    const isLoading = () => rootSkeletons.size > 0;

    /** Subscribers, per event (also the per-item `optionActive:<id>` events). Sets are created on demand. */
    const subscribers = new Map<keyof CompositeEventMap, Set<Subscriber>>();
    /** The last dispatched value of the static events (the per-item events are derived, see `getSnapshot`). */
    type LatestValues = { [K in keyof CompositeEventMap]?: CompositeEventMap[K] };
    // `open` has a value from creation so pull-based subscribers read it before any change.
    const initialValues = (): LatestValues => ({ open: isOpen });
    let latestValues = initialValues();

    function emit<K extends keyof CompositeEventMap>(event: K, value: CompositeEventMap[K]) {
        subscribers.get(event)?.forEach((cb) => cb(value));
    }

    function notify<K extends keyof CompositeEventMap>(event: K, value: CompositeEventMap[K]) {
        latestValues[event] = value;
        emit(event, value);
    }

    /** Set the active descendant, then notify the 2 affected items only: first the previous one, then the new one. */
    function setActiveDescendant(id: string | null) {
        const previous = latestValues.activeDescendantChange ?? null;
        notify('activeDescendantChange', id);
        if (previous === id) return;
        if (previous) emit(optionActiveEvent(previous), false);
        if (id) emit(optionActiveEvent(id), true);
    }

    // Forward-declared so the DOM listeners can reference `handle` (via closure) before it is constructed.
    let handle!: CompositeHandle;

    /** The element that holds DOM focus and `aria-activedescendant`. */
    const getFocusOwner = (): HTMLElement | null => (link ? link.getFocusOwner() : mounted?.element ?? null);

    /**
     * Whether the composite has visible items or root skeletons. A nested skeleton is visible only when its
     * parent item is visible, and then the visible item count is not zero.
     */
    const hasVisibleContent = () => specialization.getVisibleCount(filter) > 0 || isLoading();

    /**
     * Whether the mounted element holds a status (the live region, e.g. a `Combobox.State` inside the list),
     * outside of a hidden subtree. The status is always rendered (visually hidden when it shows no message), so
     * that the live region stays in the accessibility tree: the element must not hide it. (Read when the items
     * or the skeletons change: a status is rendered with the list, not later.)
     */
    function hasStatus(container: HTMLElement) {
        return Array.from(container.querySelectorAll(`.${STATUS_CLASSNAME}`)).some((status) => {
            const hiddenAncestor = status.parentElement?.closest('[hidden]');
            return !hiddenAncestor || hiddenAncestor === container || !container.contains(hiddenAncestor);
        });
    }

    /** Hide the mounted element (`hidden`) when it has no visible content and no status. */
    function syncHidden() {
        const element = mounted?.element;
        if (!element) return;
        element.toggleAttribute('hidden', !hasVisibleContent() && !hasStatus(element));
    }

    function notifyOptionsChange() {
        syncHidden();
        const next = {
            optionsLength: specialization.getVisibleCount(filter),
            inputValue: link?.getInputValue?.() ?? '',
            isCountHidden: specialization.isCountHidden?.(filter) ?? false,
        };
        const isEmpty = next.optionsLength === 0;
        if (
            next.optionsLength !== lastOptions.optionsLength ||
            next.isCountHidden !== lastOptions.isCountHidden ||
            (isEmpty && next.inputValue !== lastOptions.inputValue)
        ) {
            lastOptions = next;
            notify('optionsChange', next);
        }
    }

    // ── Loading announcement ──────────────────────────────────

    /** Whether any skeleton is registered (at the root or in a nested level). */
    const hasSkeleton = () => rootSkeletons.size + nestedSkeletons.size > 0;

    /**
     * Start the debounced loading announcement when the items are visible and a skeleton is registered.
     * Every change that makes it false (close, last skeleton removed, destroy) cancels the timer.
     */
    function startLoadingAnnouncementTimer() {
        clearTimeout(loadingTimer);
        if (!hasSkeleton() || !isOpen) return;
        loadingTimer = setTimeout(() => {
            announcementSent = true;
            notify('loadingAnnouncement', true);
        }, LOADING_ANNOUNCEMENT_DELAY);
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
        syncHidden();
        if (isLoading() !== wasLoading) {
            notify('loadingChange', isLoading());
        }
        if (hasSkeleton() === hadSkeleton) return;
        if (hadSkeleton) resetLoadingAnnouncement();
        else startLoadingAnnouncementTimer();
    }

    // ── Mount (DOM) ───────────────────────────────────────────

    function unmount() {
        mounted?.controller.abort();
        mounted = null;
    }

    function mount(container: HTMLElement): () => void {
        if (mounted?.element === container) return () => {};
        unmount();
        const controller = new AbortController();
        const { signal } = controller;

        /**
         * Standalone only: true after a pointer press on the composite, until the next key press or blur.
         * In pointer mode, the active item is kept (`aria-activedescendant`) but the focus ring is hidden,
         * so that the ring only shows for keyboard interaction.
         */
        let isPointerModality = false;

        // The specialization selects the navigation module (pattern) from the element.
        const nav = specialization.createNavigation({
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
                    setActiveDescendant(item.id);
                    requestAnimationFrame(() => {
                        // Skip the scroll when the composite unmounted in the meantime.
                        if (!signal.aborted) nav.scrollIntoView(item);
                    });
                },
                onDeactivate(item) {
                    item.removeAttribute('data-focus-visible-added');
                },
                onClear() {
                    getFocusOwner()?.setAttribute('aria-activedescendant', '');
                    setActiveDescendant(null);
                },
            },
        });
        const { focusNav, cellSelector } = nav;
        const typeahead = createTypeahead(
            () => createSelectorTreeWalker(container, cellSelector),
            getOptionLabel,
            signal,
        );
        mounted = { element: container, navigation: nav, typeahead, controller };
        syncHidden();
        link?.onMount?.(container);

        // ── Delegated listeners ───────────────────────────────

        container.addEventListener(
            'click',
            (event) => {
                const cell = (event.target as HTMLElement).closest(cellSelector) as HTMLElement | null;
                if (!cell) return;
                // Do not select disabled cells.
                if (isOptionDisabled(cell)) {
                    event.stopPropagation();
                    return;
                }
                // Not an option cell (e.g. grid action cell) — skip the selection, let its own handler fire.
                if (!nav.isOptionCell(cell)) return;

                handle.select(cell);
                getFocusOwner()?.focus();
                // Standalone: the clicked item becomes the active item.
                if (isStandalone) focusNav.goTo(() => cell);
            },
            { signal },
        );

        // Prevent mousedown on cells to avoid moving focus away from the focus owner before click fires.
        container.addEventListener(
            'mousedown',
            (event) => {
                // Standalone: pointer interaction hides the focus ring (until the next key press).
                if (isStandalone) isPointerModality = true;
                if ((event.target as HTMLElement).closest(cellSelector)) event.preventDefault();
            },
            { signal },
        );

        specialization.onMount?.(container, signal);

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
            container.addEventListener(
                'focus',
                () => {
                    if (!focusNav.selectors.activeItem) handle.activateDefaultItem('first');
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
            if (mounted?.element === container) unmount();
        };
    }

    handle = {
        get element() {
            return mounted?.element ?? null;
        },
        get type() {
            return mounted?.navigation.type ?? null;
        },
        get activeItem() {
            return mounted?.navigation.focusNav.selectors.activeItem ?? null;
        },
        get isStandalone() {
            return isStandalone;
        },
        get isOpen() {
            return isOpen;
        },
        get isMultiSelect() {
            return mounted?.element.getAttribute('aria-multiselectable') === 'true';
        },
        get hasVisibleContent() {
            return hasVisibleContent();
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

        handleKeydown(event: KeyboardEvent): boolean {
            if (!mounted) return false;
            const { navigation, typeahead } = mounted;
            const nav = navigation.focusNav;
            const { activeItem, hasNavigableItems } = nav.selectors;
            switch (event.key) {
                // Arrows: consume the key even without navigable items (nothing to move to, no pending intent).
                case 'ArrowDown':
                    if (activeItem) nav.goDown();
                    else if (hasNavigableItems) handle.activateDefaultItem('first');
                    return true;
                case 'ArrowUp':
                    if (activeItem) nav.goUp();
                    else if (hasNavigableItems) handle.activateDefaultItem('last');
                    return true;
                case 'ArrowLeft':
                case 'ArrowRight':
                    // Delegated to the navigation module (e.g. grid: move between cells, tree: open or close).
                    // Standalone: consume the key even when nothing moved (like ArrowDown/ArrowUp, the arrow
                    // keys never leak to the page). Linked: the combobox input moves its caret instead.
                    return navigation.navigateHorizontal(event.key) || isStandalone;
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
                        typeahead.handle(event.key, activeItem);
                        nav.goTo((n) => typeahead.rematch(n.activeItem));
                        return true;
                    }
                    return false;
            }
        },

        flushPendingNavigation() {
            mounted?.navigation.focusNav.flushPendingNavigation();
        },

        clearActiveItem() {
            mounted?.navigation.focusNav.clear();
        },

        setActiveItem(item: HTMLElement) {
            mounted?.navigation.focusNav.goTo(() => item);
        },

        activateDefaultItem(edge: 'first' | 'last') {
            mounted?.navigation.focusNav.goTo(
                (s) => s.getMatching(isSelected) ?? (edge === 'first' ? s.getFirst() : s.getLast()),
            );
        },

        setFilter(value: string, mode: CompositeFilterMode = 'auto') {
            filter = { value, mode };
            specialization.applyFilter(filter);
            notifyOptionsChange();
        },

        registerSkeleton({ isNested = false } = {}) {
            const skeletons = isNested ? nestedSkeletons : rootSkeletons;
            const token = {};
            const update = (change: () => void) => {
                const wasLoading = isLoading();
                const hadSkeleton = hasSkeleton();
                change();
                onSkeletonCountChange(wasLoading, hadSkeleton);
            };
            update(() => skeletons.add(token));
            return () => {
                if (skeletons.has(token)) update(() => skeletons.delete(token));
            };
        },

        subscribe(event, callback) {
            let set = subscribers.get(event);
            if (!set) {
                set = new Set();
                subscribers.set(event, set);
            }
            const subscriber = callback as Subscriber;
            set.add(subscriber);
            return () => {
                set.delete(subscriber);
                if (!set.size && subscribers.get(event) === set) subscribers.delete(event);
            };
        },

        getSnapshot(event) {
            if (isOptionActiveEvent(event)) {
                // Derived value. No per-id value is stored.
                return (latestValues.activeDescendantChange ===
                    getOptionActiveId(event)) as CompositeEventMap[typeof event];
            }
            return latestValues[event] as CompositeEventMap[typeof event];
        },

        destroy() {
            unmount();
            clearTimeout(loadingTimer);
            announcementSent = false;
            filter = NO_FILTER;
            lastOptions = INITIAL_OPTIONS;
            isOpen = isStandalone;
            rootSkeletons.clear();
            nestedSkeletons.clear();
            // After the state reset: the initial values read it.
            latestValues = initialValues();
            specialization.destroy?.();
            subscribers.clear();
        },
    };

    return { handle, notifyOptionsChange, getFilter: () => filter };
}
