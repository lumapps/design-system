import type { ComboboxCallbacks, ComboboxHandle } from './types';
import { setupCombobox } from './setupCombobox';
import { createTypeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { isPrintableKey } from '../../utils/browser/isPrintableKey';
import { getOptionLabel } from './utils';

/**
 * Set up a combobox with a button trigger (select-only pattern).
 *
 * Creates a full combobox handle with the button-mode controller automatically
 * wired in and the trigger registered. The consumer only needs to call
 * `handle.registerListbox(listbox)`.
 *
 * Handles: Space (select/open), Home/End (listbox navigation),
 * printable characters (typeahead), and click (toggle).
 *
 * @param button    The button element to use as the combobox trigger.
 * @param callbacks Callbacks for select and open/close events.
 * @returns A ComboboxHandle for interacting with the combobox.
 */
export function setupComboboxButton(button: HTMLButtonElement, callbacks: ComboboxCallbacks): ComboboxHandle {
    const handle = setupCombobox(callbacks, undefined, (combobox, signal) => {
        const typeahead = createTypeahead(
            () => {
                if (!combobox.listbox) return null;
                // In grid mode, walk gridcells (first cell per row is the option cell).
                // In list mode, walk option elements.
                const selector = combobox.focusNav?.type === 'grid' ? '[role="gridcell"]' : '[role="option"]';
                return createSelectorTreeWalker(combobox.listbox, selector);
            },
            getOptionLabel,
            signal,
        );

        // Click toggles the listbox.
        button.addEventListener('click', () => combobox.setIsOpen(!combobox.isOpen), { signal });

        return (event: KeyboardEvent): boolean => {
            const nav = combobox.focusNav;

            switch (event.key) {
                case 'Tab':
                    // Selects the focused option
                    if (combobox.isOpen && nav?.selectors.activeItem) {
                        combobox.select(nav.selectors.activeItem);
                    }
                    // Return false to continue normal 'Tab' behavior (focus next).
                    return false;

                case ' ':
                    // Space acts like Enter in button mode.
                    if (combobox.isOpen && nav?.selectors.activeItem) {
                        // Click the active item — delegated handler handles select + close.
                        nav.selectors.activeItem.click();
                    } else {
                        combobox.setIsOpen(true);
                    }
                    return true;

                case 'ArrowUp':
                    // Alt+ArrowUp: select the focused option and close.
                    if (event.altKey && combobox.isOpen && nav?.selectors.activeItem) {
                        combobox.select(nav.selectors.activeItem);
                        combobox.setIsOpen(false);
                        return true;
                    }
                    // All other ArrowUp cases handled by base handler.
                    return false;

                case 'Home':
                    // `goTo` focuses the first option immediately when open, or defers
                    // until the options commit when opening from closed.
                    combobox.setIsOpen(true);
                    nav?.goTo((n) => n.getFirst());
                    return true;

                case 'End':
                    combobox.setIsOpen(true);
                    nav?.goTo((n) => n.getLast());
                    return true;

                case 'ArrowLeft':
                    // Grid mode: navigate to previous cell.
                    if (nav?.type === 'grid' && combobox.isOpen && nav.selectors.activeItem) {
                        nav.goLeft();
                        return true;
                    }
                    return false;

                case 'ArrowRight':
                    // Grid mode: navigate to next cell.
                    if (nav?.type === 'grid' && combobox.isOpen && nav.selectors.activeItem) {
                        nav.goRight();
                        return true;
                    }
                    return false;

                case 'Escape':
                    // Close if open; never clear selection (button-mode has no text input).
                    if (combobox.isOpen) {
                        combobox.setIsOpen(false);
                    }
                    return true;

                default:
                    // Printable characters → typeahead.
                    if (isPrintableKey(event)) {
                        combobox.setIsOpen(true);
                        typeahead.handle(event.key, nav?.selectors.activeItem ?? null);
                        nav?.goTo((n) => typeahead.rematch(n.activeItem));
                        return true;
                    }
                    return false;
            }
        };
    });

    handle.registerTrigger(button);
    return handle;
}
