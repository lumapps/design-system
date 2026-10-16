import type { ComboboxCallbacks, ComboboxHandle, ComboboxInputOptions } from './types';
import { setupCombobox } from './setupCombobox';

/** Options for configuring the input-mode combobox controller. */
export interface SetupComboboxInputOptions extends ComboboxCallbacks, ComboboxInputOptions {
    /**
     * Called synchronously on every user input event (typing, paste, delete…)
     * (Use this in framework wrappers that maintain controlled input state, like React)
     */
    onInput?(value: string): void;
    /**
     * Called when the input value should change as a result of option selection,
     * with `selectionMode` already applied.
     *
     * - `'fill'` (default): called with the selected option value.
     * - `'clear'`: called with an empty string.
     * - `'keep'`: NOT called (input value unchanged).
     */
    onChange?(value: string): void;
}

/**
 * Set up a combobox with an input trigger (autocomplete/filter pattern).
 *
 * Creates a full combobox handle with the input-mode controller automatically
 * wired in and the trigger registered. The consumer only needs to register the list
 * (created with `handle.listOptions`) with `handle.registerList(list)`.
 *
 * Handles: Home/End (text cursor), ArrowLeft/Right (clear active descendant),
 * filtering (on input and on open), and focus behavior.
 *
 * @param input   The input element to use as the combobox trigger.
 * @param options Options and callbacks for configuring the input-mode controller.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupComboboxInput(input: HTMLInputElement, options: SetupComboboxInputOptions): ComboboxHandle {
    let handle: ComboboxHandle;
    const {
        filter = 'auto',
        selectionMode = 'fill',
        onSelect: optionOnSelect,
        onInput: onInputCallback,
        onChange: onChangeCallback,
    } = options;
    const openOnFocus = options.openOnFocus ?? filter === 'off';
    /**
     * Mode of the list filter: `'auto'` hides the items that do not match, `'manual'` only tells the list the
     * filter text (e.g. a tree opens its parent items). No filter with `'off'`.
     */
    const filterMode = filter === 'off' ? null : filter;

    /** Check if the input is disabled (native `disabled` attribute or `aria-disabled="true"`). */
    const isDisabled = () => input.disabled || input.getAttribute('aria-disabled') === 'true';

    /**
     * True when the current input value came from user typing (real InputEvent).
     * False when the value was set programmatically (select, clear, etc.).
     * Used to decide whether to re-apply the filter when the combobox opens.
     */
    let userHasTyped = false;

    /**
     * Wraps the consumer's onSelect to perform input-mode side effects after selection,
     * and drive `onChange` according to `selectionMode`.
     * Filter and typing state are always reset on selection.
     */
    const onSelect = (option: { value: string }) => {
        optionOnSelect?.(option);
        userHasTyped = false;
        if (filterMode) handle.list?.setFilter('', filterMode);

        if (selectionMode === 'fill') {
            onChangeCallback?.(option.value);
        } else if (selectionMode === 'clear') {
            onChangeCallback?.('');
        }
        // 'keep': onChange is not called — input value stays as-is.
    };

    handle = setupCombobox({ onSelect }, { wrapNavigation: true }, (combobox, signal) => {
        signal.addEventListener('abort', () => {
            userHasTyped = false;
        });

        // Filter on real user typing (InputEvent with `inputType`).
        input.addEventListener(
            'input',
            (event) => {
                if (!(event instanceof InputEvent)) return;
                if (isDisabled()) return;

                combobox.list?.focusNav?.clear();
                userHasTyped = true;

                // Notify the framework wrapper of the new input value synchronously.
                onInputCallback?.(input.value);

                combobox.setIsOpen(true);

                if (filterMode) {
                    combobox.list?.setFilter(input.value, filterMode);
                }
            },
            { signal },
        );

        // Open on focus (only when openOnFocus is enabled).
        input.addEventListener(
            'focus',
            () => {
                if (isDisabled()) return;
                combobox.list?.focusNav?.clear();
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

        // Always open: the input loses focus with no close, so reset the typing state and the filter here
        // (the framework wrapper resets the search text on blur).
        input.addEventListener(
            'focusout',
            () => {
                if (!combobox.alwaysOpen) return;
                userHasTyped = false;
                if (filterMode) combobox.list?.setFilter('', filterMode);
            },
            { signal },
        );

        // Re-apply filter when the combobox opens (or when a list registers), but only if the current
        // input value came from user typing. After a programmatic change
        // (select, clear), all options should remain visible.
        const reapplyFilter = () => {
            if (combobox.isOpen && filterMode && userHasTyped) {
                combobox.list?.setFilter(input.value, filterMode);
            }
        };
        const unsubscribeOpen = combobox.subscribe('open', reapplyFilter);
        const unsubscribeList = combobox.subscribe('list', reapplyFilter);
        signal.addEventListener('abort', () => {
            unsubscribeOpen();
            unsubscribeList();
        });

        return (event: KeyboardEvent): boolean => {
            const nav = combobox.list?.focusNav;

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
                    // Grid and tree patterns: navigate when an active item exists.
                    if (combobox.list?.navigateHorizontal(event.key)) return true;
                    // Otherwise: clear active item, allow caret movement.
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
