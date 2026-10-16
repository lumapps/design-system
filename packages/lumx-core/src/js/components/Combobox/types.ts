import type { CompositeEventMap, CompositeEventSource, CompositeHandle, CompositeOptions } from '../Composite/types';

/** Callbacks provided by the consumer (React/Vue) to react to combobox state changes. */
export interface ComboboxCallbacks {
    /** Called when an option is selected (click or keyboard). */
    onSelect?(option: { value: string }): void;
}

/**
 * Behavioral options for input-mode combobox (autocomplete/filter pattern).
 * Shared between the core JSX template props (`ComboboxInputProps`) and the
 * runtime controller options (`SetupComboboxInputOptions`).
 */
export interface ComboboxInputOptions {
    /**
     * Controls how the combobox filters options as the user types.
     *
     * - `'auto'` (default) — Options are automatically filtered client-side.
     * - `'manual'` — Filtering is the consumer's responsibility.
     * - `'off'` — Like `'manual'`, but the input is rendered as `readOnly`
     *   and `openOnFocus` defaults to `true`.
     */
    filter?: 'auto' | 'manual' | 'off';
    /**
     * When true, the combobox opens automatically when the input receives focus.
     * When false (default, unless `filter` is `'off'`), the combobox only opens
     * on click, typing, or keyboard navigation.
     *
     * @default false (true when filter is 'off')
     */
    openOnFocus?: boolean;
    /**
     * Controls what happens to the input value when an option is selected.
     *
     * - `'fill'` (default) — The input is updated with the selected option value via `onChange`.
     * - `'keep'` — The input value is left unchanged; `onChange` is not called.
     *   Useful when the component manages the displayed value independently (e.g. showing
     *   an option display name rather than the raw option ID). The filter still resets.
     * - `'clear'` — The input is cleared (empty string) via `onChange` after selection.
     *   Useful for multi-select patterns where typing starts fresh after each pick.
     *
     * @default 'fill'
     */
    selectionMode?: 'fill' | 'keep' | 'clear';
}

/**
 * Map of combobox event names to their payload types.
 *
 * The combobox owns `open` and `composite`. The other events are the ones of the attached list (see
 * {@link CompositeEventMap}): the combobox forwards them from the current list, re-subscribes when the list
 * changes, and then dispatches the snapshot of the new list (`undefined` when no list is attached).
 */
export interface ComboboxEventMap extends CompositeEventMap {
    /**
     * Fired when the popup opens or closes (see {@link ComboboxHandle.setIsOpen}).
     * Owned by the combobox (it exists before any list registers) and forwarded to the registered list.
     * Replayed on subscribe while open.
     */
    open: boolean;
    /**
     * Fired when a composite (listbox, grid, tree, …) attaches as the list of the combobox, or detaches (see
     * {@link ComboboxHandle.attachList}). Payload: the composite handle, or null.
     */
    composite: CompositeHandle | null;
}

/**
 * Handle returned by `setupCombobox`. Used by framework wrappers and mode controllers.
 *
 * The combobox owns the trigger and the popup open state. The list is late-bound: the list component
 * attaches its own composite handle (e.g. `setupListbox`) with {@link ComboboxHandle.attachList}. The list
 * owns the item registry, the filter, the focus navigation, the selection, the loading state and the list events.
 */
export interface ComboboxHandle extends CompositeEventSource<ComboboxEventMap> {
    /** Register the trigger element. Returns a cleanup function. */
    registerTrigger(trigger: HTMLInputElement | HTMLButtonElement): () => void;
    /**
     * Create the list handle with the combobox list options, and register it: the current open state is
     * forwarded to it. Attaching another list replaces the previous one.
     *
     * The list options link the list to the combobox: the trigger is the focus owner (`aria-activedescendant`,
     * `aria-haspopup` and the inline detection on mount), a single selection closes the popup, and the input
     * trigger wraps the navigation.
     *
     * Returns the list and `detach`, which unregisters the list (if it is still the current one), then destroys it.
     */
    attachList<H extends CompositeHandle>(createList: (options: CompositeOptions) => H): { list: H; detach(): void };
    /** Tear down all listeners and state (the attached list is unregistered, not destroyed: its `detach` destroys it). */
    destroy(): void;

    /** The current trigger element (may be null before registration). */
    readonly trigger: HTMLInputElement | HTMLButtonElement | null;
    /** The attached list handle (null until a list attaches). */
    readonly list: CompositeHandle | null;
    /** Whether the popup is open. */
    readonly isOpen: boolean;
    /** Whether the list is always open (see {@link ComboboxHandle.setAlwaysOpen}). */
    readonly alwaysOpen: boolean;

    /**
     * Set the open state and update ARIA. Subscribe to `open` to observe it.
     * When always open, a close request only clears the active option.
     */
    setIsOpen(isOpen: boolean): void;
    /**
     * Force the list always open (inline list, not in a popup) or not. With `false`, the list uses the
     * open/close behavior (the list closes). When always open, focus out, selection and Escape do not
     * close the list. With `undefined` (default), the list is always open when it is mounted outside of a
     * `Combobox.Popover`.
     */
    setAlwaysOpen(alwaysOpen: boolean | undefined): void;
}

/**
 * Callback invoked when the trigger is attached and the abort controller is ready.
 *
 * The callback can optionally return a mode-specific keydown hook. When returned,
 * it is called before the shared keydown handler; return `true` to indicate the
 * event was handled (the caller will call `stopPropagation`/`preventDefault`)
 * and skip the shared logic.
 */
export type OnTriggerAttach = (
    handle: ComboboxHandle,
    signal: AbortSignal,
) => ((event: KeyboardEvent) => boolean) | void;
