import type { ComboboxCallbacks, ComboboxHandle } from './types';
import { setupCombobox } from './setupCombobox';

/** Options for configuring the input-mode combobox controller. */
export interface SetupComboboxInputOptions extends ComboboxCallbacks {
    /**
     * Controls how the combobox filters options as the user types.
     *
     * - `'auto'` (default) — Options are automatically filtered client-side.
     * - `'manual'` — Filtering is the consumer's responsibility.
     * - `'off'` — Like `'manual'`, and `openOnFocus` defaults to `true`.
     *   The core template renders the input as `readOnly`.
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
}

/**
 * Set up a combobox with an input trigger (autocomplete/filter pattern).
 *
 * Creates a full combobox handle with the input-mode controller automatically
 * wired in and the trigger registered. The consumer only needs to call
 * `handle.registerListbox(listbox)`.
 *
 * Handles: Home/End (text cursor), ArrowLeft/Right (clear active descendant),
 * filtering (on input and on open), and focus behavior.
 *
 * @param input   The input element to use as the combobox trigger.
 * @param options Options and callbacks for configuring the input-mode controller.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupComboboxInput(input: HTMLInputElement, options: SetupComboboxInputOptions): ComboboxHandle {
    const { filter = 'auto', onSelect: optionOnSelect } = options;
    const openOnFocus = options.openOnFocus ?? filter === 'off';
    const autoFilter = filter === 'auto';

    /** Check if the input is disabled (native `disabled` attribute or `aria-disabled="true"`). */
    const isDisabled = () => input.disabled || input.getAttribute('aria-disabled') === 'true';

    /**
     * True when the current input value came from user typing (real InputEvent).
     * False when the value was set programmatically (select, clear, etc.).
     * Used to decide whether to re-apply the filter when the combobox opens.
     */
    let userHasTyped = false;

    /**
     * Wraps the consumer's onSelect to perform input-mode side effects after selection:
     * clears the active descendant, resets the filter, and re-opens the popup.
     */
    const onSelect = (option: { value: string }, combobox: ComboboxHandle) => {
        optionOnSelect(option, combobox);

        // Clear the active item. In multi-select, keep visual focus so the
        // user can continue navigating after selection.
        if (!combobox.isMultiSelect) {
            combobox.focusNav?.clear();
        }
        userHasTyped = false;
        combobox.setIsOpen(true);
        if (autoFilter) {
            combobox.setFilter('');
        }
    };

    const handle = setupCombobox({ onSelect }, { wrapNavigation: true }, (combobox, signal) => {
        signal.addEventListener('abort', () => {
            userHasTyped = false;
        });

        // Filter on real user typing (InputEvent with `inputType`).
        input.addEventListener(
            'input',
            (event) => {
                if (!(event instanceof InputEvent)) return;
                if (isDisabled()) return;

                combobox.focusNav?.clear();
                userHasTyped = true;
                combobox.setIsOpen(true);

                if (autoFilter) {
                    combobox.setFilter(input.value);
                }
            },
            { signal },
        );

        // Open on focus (only when openOnFocus is enabled).
        input.addEventListener(
            'focus',
            () => {
                if (isDisabled()) return;
                combobox.focusNav?.clear();
                if (openOnFocus) {
                    combobox.setIsOpen(true);
                }
            },
            { signal },
        );

        // Open on click (handles the case where the input is already focused, so focus doesn't re-fire).
        input.addEventListener(
            'click',
            () => {
                if (isDisabled()) return;
                combobox.setIsOpen(true);
            },
            { signal },
        );

        // Re-apply filter when the combobox opens, but only if the current
        // input value came from user typing. After a programmatic change
        // (select, clear), all options should remain visible.
        const unsubscribeOpen = combobox.subscribe('open', (isOpen) => {
            if (isOpen && autoFilter && userHasTyped) {
                combobox.setFilter(input.value);
            }
        });
        signal.addEventListener('abort', unsubscribeOpen);

        return (event: KeyboardEvent): boolean => {
            const nav = combobox.focusNav;

            switch (event.key) {
                case 'Home':
                    input.setSelectionRange(0, 0);
                    nav?.clear();
                    return true;

                case 'End': {
                    const len = input.value.length;
                    input.setSelectionRange(len, len);
                    nav?.clear();
                    return true;
                }

                case 'ArrowLeft':
                case 'ArrowRight':
                    // Grid mode: navigate cells when active item exists.
                    if (nav?.type === 'grid' && nav.hasActiveItem) {
                        if (event.key === 'ArrowLeft') nav.goLeft();
                        else nav.goRight();
                        return true;
                    }
                    // Listbox mode: clear active item, allow caret movement.
                    nav?.clear();
                    return false;

                default:
                    return false;
            }
        };
    });

    handle.registerTrigger(input);
    return handle;
}
