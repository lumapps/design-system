import type { ComboboxCallbacks, ComboboxHandle } from './types';
import { setupCombobox } from './setupCombobox';
import { createTypeahead } from '../../utils/typeahead';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { getOptionValue } from './utils';

/** Is the key a single printable character (not Space, no modifier keys)? */
function isPrintableKey({ key, altKey, ctrlKey, metaKey }: KeyboardEvent): boolean {
    return key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey;
}

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
            getOptionValue,
            signal,
        );

        // Click toggles the listbox.
        button.addEventListener('click', () => combobox.setIsOpen(!combobox.isOpen), { signal });

        return (event: KeyboardEvent): boolean => {
            const nav = combobox.focusNav;

            switch (event.key) {
                case ' ':
                    // Space acts like Enter in button mode.
                    if (combobox.isOpen && nav?.hasActiveItem && nav.activeItem) {
                        // Click the active item — delegated handler handles select + close.
                        nav.activeItem.click();
                    } else {
                        combobox.setIsOpen(true);
                    }
                    return true;

                case 'ArrowUp':
                    // Alt+ArrowUp: select the focused option and close.
                    if (event.altKey && combobox.isOpen && nav?.hasActiveItem && nav.activeItem) {
                        combobox.select(nav.activeItem);
                        combobox.setIsOpen(false);
                        return true;
                    }
                    // All other ArrowUp cases handled by base handler.
                    return false;

                case 'Home':
                    combobox.setIsOpen(true);
                    nav?.goToFirst();
                    return true;

                case 'End':
                    combobox.setIsOpen(true);
                    nav?.goToLast();
                    return true;

                case 'ArrowLeft':
                    // Grid mode: navigate to previous cell.
                    if (nav?.type === 'grid' && combobox.isOpen && nav.hasActiveItem) {
                        nav.goLeft();
                        return true;
                    }
                    return false;

                case 'ArrowRight':
                    // Grid mode: navigate to next cell.
                    if (nav?.type === 'grid' && combobox.isOpen && nav.hasActiveItem) {
                        nav.goRight();
                        return true;
                    }
                    return false;

                default:
                    // Printable characters → typeahead.
                    if (isPrintableKey(event)) {
                        combobox.setIsOpen(true);
                        const match = typeahead.handle(event.key, nav?.activeItem ?? null);
                        if (match && nav) {
                            nav.goToItem(match);
                        }
                        return true;
                    }
                    return false;
            }
        };
    });

    handle.registerTrigger(button);
    return handle;
}
