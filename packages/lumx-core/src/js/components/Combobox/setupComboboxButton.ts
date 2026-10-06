import type { ComboboxCallbacks, ComboboxHandle } from './types';
import { setupCombobox } from './setupCombobox';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';

/**
 * Set up a combobox with a button trigger (select-only pattern).
 *
 * Creates a full combobox handle with the button-mode controller automatically
 * wired in and the trigger registered. The consumer only needs to call
 * `handle.list.mount(listbox)`.
 *
 * Handles what is button-specific: click (toggle), Space (open), Tab and Alt+ArrowUp (select),
 * and "open first" for Home/End, ArrowLeft/Right and typeahead. The navigation itself is
 * delegated to `list.handleKeydown`.
 *
 * @param button    The button element to use as the combobox trigger.
 * @param callbacks Callbacks for select and open/close events.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupComboboxButton(button: HTMLButtonElement, callbacks: ComboboxCallbacks): ComboboxHandle {
    const handle = setupCombobox(callbacks, undefined, (combobox, signal) => {
        // Click toggles the listbox.
        button.addEventListener('click', () => combobox.setIsOpen(!combobox.isOpen), { signal });

        return (event: KeyboardEvent): boolean => {
            const nav = combobox.list.focusNav;

            switch (event.key) {
                case 'Tab':
                    // Selects the focused option
                    if (combobox.isOpen && nav?.selectors.activeItem) {
                        combobox.list.select(nav.selectors.activeItem);
                    }
                    // Return false to continue normal 'Tab' behavior (focus next).
                    return false;

                case ' ':
                    // Space acts like Enter in button mode: open, or "click" the active option (listbox).
                    if (combobox.isOpen) combobox.list.handleKeydown(event);
                    else combobox.setIsOpen(true);
                    return true;

                case 'ArrowUp':
                    // Alt+ArrowUp: select the focused option and close.
                    if (event.altKey && combobox.isOpen && nav?.selectors.activeItem) {
                        combobox.list.select(nav.selectors.activeItem);
                        combobox.setIsOpen(false);
                        return true;
                    }
                    // All other ArrowUp cases handled by base handler.
                    return false;

                case 'Home':
                case 'End':
                    // Open, then jump (the listbox defers the jump until the options commit when opening from closed).
                    combobox.setIsOpen(true);
                    combobox.list.handleKeydown(event);
                    return true;

                case 'ArrowLeft':
                case 'ArrowRight':
                    // Grid pattern: navigate to the previous/next cell (listbox).
                    return combobox.isOpen && combobox.list.handleKeydown(event);

                case 'Escape':
                    // Close if open; never clear selection (button-mode has no text input).
                    if (combobox.isOpen) {
                        combobox.setIsOpen(false);
                        return true;
                    }
                    // Closed: let Escape propagate (ex: so a surrounding dialog can close).
                    // The base handler does not clear the selection on a button trigger.
                    return false;

                default:
                    // Printable characters: open, then typeahead (listbox).
                    if (!isPrintableKey(event)) return false;
                    combobox.setIsOpen(true);
                    combobox.list.handleKeydown(event);
                    return true;
            }
        };
    });

    handle.registerTrigger(button);
    return handle;
}
