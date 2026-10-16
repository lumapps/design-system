import type { CompositeEventSource, CompositeHandle, CompositeOptions } from '../Composite/types';

export type { SectionState, SectionRegistration, OptionRegistration, OptionActiveEvent } from '../Listbox/types';

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
     * - `'manual'` — Filtering is the consumer's responsibility. The list still gets the filter text
     *   (a tree list opens its parent items with rendered sub-items while the text is not empty).
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

/** Map of combobox event names to their payload types. */
export interface ComboboxEventMap {
    /**
     * Fired when the popup opens or closes (see {@link ComboboxHandle.setIsOpen}).
     * Owned by the combobox (it exists before any list registers) and forwarded to the registered list.
     * Replayed on subscribe while open.
     */
    open: boolean;
    /** Fired when a list registers or unregisters (see {@link ComboboxHandle.registerList}). Payload: the list. */
    list: CompositeHandle | null;
}

/**
 * Handle returned by `setupCombobox`. Used by framework wrappers and mode controllers.
 *
 * The combobox owns the trigger and the popup open state. The list is late-bound: the list component
 * creates its own composite handle (e.g. `setupListbox`) with {@link ComboboxHandle.listOptions}, then
 * registers it with {@link ComboboxHandle.registerList}. The list owns the item registry, the filter,
 * the focus navigation, the selection, the loading state and the list events.
 */
export interface ComboboxHandle extends CompositeEventSource<ComboboxEventMap> {
    /** Register the trigger element. Returns a cleanup function. */
    registerTrigger(trigger: HTMLInputElement | HTMLButtonElement): () => void;
    /**
     * Register the list handle (created with {@link ComboboxHandle.listOptions}). The current open state is
     * forwarded to it. Registering another list replaces the previous one. Returns an unregister function.
     */
    registerList(list: CompositeHandle): () => void;
    /** Tear down all listeners and state (the registered list is unregistered, not destroyed). */
    destroy(): void;

    /** The current trigger element (may be null before registration). */
    readonly trigger: HTMLInputElement | HTMLButtonElement | null;
    /** The registered list handle (null until a list registers). */
    readonly list: CompositeHandle | null;
    /**
     * Options to create the list handle with: the trigger as focus owner (`aria-activedescendant`,
     * `aria-haspopup` and inline detection on mount), the selection (closes the popup on a single
     * selection) and the navigation wrap of the input trigger.
     */
    readonly listOptions: CompositeOptions;
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
