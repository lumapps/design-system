import type { ListboxHandle } from '../Listbox/types';

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
 * Handle returned by `setupCombobox`. Used by framework wrappers and mode controllers.
 *
 * The combobox owns the trigger. Everything else (the open state, the option registry, the filter,
 * the focus navigation, the selection, the loading state and all the events) is on the
 * {@link ListboxHandle} exposed as `list`: the listbox element is mounted with `list.mount(element)`.
 * The combobox open state is the listbox `open` event.
 */
export interface ComboboxHandle {
    /** Register the trigger element. Returns a cleanup function. */
    registerTrigger(trigger: HTMLInputElement | HTMLButtonElement): () => void;
    /** Tear down all listeners and state. */
    destroy(): void;

    /** The current trigger element (may be null before registration). */
    readonly trigger: HTMLInputElement | HTMLButtonElement | null;
    /** The listbox handle (option registry, filter, focus navigation, selection, listbox events). */
    readonly list: ListboxHandle;
    /** Whether the popup is open (same as `list.isOpen`). */
    readonly isOpen: boolean;

    /** Set the open state and update ARIA. Subscribe to `list` `open` to observe it. */
    setIsOpen(isOpen: boolean): void;
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
