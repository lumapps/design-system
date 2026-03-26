import type { ComboboxCallbacks, ComboboxHandle } from './types';
import { setupCombobox } from './setupCombobox';

/** Options for configuring the input-mode combobox controller. */
export interface SetupComboboxInputOptions {
    /**
     * When true (default), the combobox automatically filters options as the user types.
     * Each registered `Combobox.Option` receives filter state updates and hides itself
     * when it does not match the current input value.
     *
     * Set to false when you want to handle filtering yourself (e.g. async search,
     * consumer-side pre-filtering). Options will not be registered for auto-filtering.
     */
    autoFilter?: boolean;
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
 * @param input     The input element to use as the combobox trigger.
 * @param callbacks Callbacks for select and open/close events.
 * @param options   Options for configuring the input-mode controller.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupComboboxInput(
    input: HTMLInputElement,
    callbacks: ComboboxCallbacks,
    options: SetupComboboxInputOptions = {},
): ComboboxHandle {
    const { autoFilter = true } = options;

    const handle = setupCombobox(callbacks, { wrapNavigation: true }, (combobox, signal) => {
        /**
         * True when the current input value came from user typing (real InputEvent).
         * False when the value was set programmatically (select, clear, etc.).
         * Used to decide whether to re-apply the filter when the combobox opens.
         */
        let userHasTyped = false;

        signal.addEventListener('abort', () => {
            userHasTyped = false;
        });

        // Filter on user typing; reset filter on programmatic input changes.
        // Real user input fires an `InputEvent` (with `inputType`), while
        // programmatic changes (selection bridge, clear, etc.) dispatch a
        // plain `Event('input')` — we use this to distinguish the two.
        input.addEventListener(
            'input',
            (event) => {
                const isUserTyping = event instanceof InputEvent;

                // Clear the active item. In multi-select with a programmatic change, keep
                // visual focus so the user can continue navigating after selection.
                if (isUserTyping || !combobox.isMultiSelect) {
                    combobox.focusNav?.clear();
                }

                userHasTyped = isUserTyping;
                combobox.setIsOpen(true);

                if (autoFilter) {
                    combobox.setFilter(isUserTyping ? input.value : '');
                }
            },
            { signal },
        );

        // Open on focus.
        input.addEventListener(
            'focus',
            () => {
                combobox.focusNav?.clear();
                combobox.setIsOpen(true);
            },
            { signal },
        );

        // Open on click (handles the case where the input is already focused, so focus doesn't re-fire).
        input.addEventListener('click', () => combobox.setIsOpen(true), { signal });

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
