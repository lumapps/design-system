import { CLASSNAME as CHIP_CLASSNAME } from '.';
import type { Selector } from '../../types/Selector';
import { createSelectorTreeWalker } from '../../utils/browser/createSelectorTreeWalker';
import { getWithSelector } from '../../utils/selectors';

/** CSS selector for enabled chips (not aria-disabled). */
const ENABLED_CHIP_SELECTOR = `.${CHIP_CLASSNAME}:not([aria-disabled="true"])`;

/** Find the closest chip element from an event target. */
const getChip = (target: EventTarget | null) =>
    (target as HTMLElement | null)?.closest?.<HTMLElement>(`.${CHIP_CLASSNAME}`) || null;

/** Whether the chip is marked as disabled via aria-disabled. */
const isChipDisabled = (chip: HTMLElement | null) => chip?.getAttribute('aria-disabled') === 'true';

/**
 * Options for setting up selection chip group event handlers.
 * All option accessors are wrapped in getters so that React/Vue can provide
 * reactive values without the core needing to know about reactivity systems.
 */
export interface SetupSelectionChipGroupEventsOptions<O> {
    /** Getter for the current selected options array. */
    getValue: () => O[] | undefined;
    /** Getter for the option id selector. */
    getOptionId: Selector<O>;
    /** Callback when the option array changes. */
    onChange: (newValue?: O[]) => void;
    /** Getter for the chip group container element. */
    getContainer: () => HTMLElement | null | undefined;
    /** Getter for the associated input element (optional). */
    getInput?: () => HTMLInputElement | null | undefined;
}

/**
 * Finds the previous enabled chip before the given chip element using a TreeWalker.
 * If no currentChip is provided, returns the last enabled chip in the container.
 */
function findPreviousChip(container: HTMLElement, currentChip?: Element | null): HTMLElement | undefined {
    const walker = createSelectorTreeWalker(container, ENABLED_CHIP_SELECTOR);

    if (!currentChip) {
        // Find the last enabled chip by walking to the end.
        let last: HTMLElement | undefined;
        while (walker.nextNode()) {
            last = walker.currentNode as HTMLElement;
        }
        return last;
    }

    // Position the walker at the current chip and walk backward.
    walker.currentNode = currentChip;
    return (walker.previousNode() as HTMLElement) || undefined;
}

/** Remove an option by its id and call onChange. */
function removeOption<O>(options: SetupSelectionChipGroupEventsOptions<O>, optionId: string) {
    const value = options.getValue();
    if (!value) return;

    const index = value.findIndex((item) => String(getWithSelector(options.getOptionId, item)) === optionId);
    if (index === -1) return;

    const newValue = [...value];
    newValue.splice(index, 1);
    options.onChange(newValue);
}

/**
 * Attach delegated click and keydown event listeners on the chip group container,
 * and optionally an input backspace handler.
 *
 * Uses addEventListener on the container element. Events bubble up from individual
 * chips, so there is no need to re-attach listeners when chips change.
 *
 * @returns A cleanup function that removes all attached event listeners.
 */
export function setupSelectionChipGroupEvents<O>(options: SetupSelectionChipGroupEventsOptions<O>): () => void {
    const container = options.getContainer();
    if (!container) return () => {};

    // Delegated click handler on the chip group container.
    const handleClick = (evt: Event) => {
        const chip = getChip(evt.target);
        const optionId = chip?.dataset.optionId;
        if (optionId == null || isChipDisabled(chip)) {
            return;
        }

        evt.stopImmediatePropagation();
        removeOption(options, optionId);
    };

    // Delegated keydown handler on the chip group container.
    // Enter/Space trigger removal (like click).
    // Backspace also removes but explicitly moves focus to previous chip (overriding the
    // roving tabindex MutationObserver which defaults to moving focus forward).
    const handleKeyDown = (evt: KeyboardEvent) => {
        const chip = getChip(evt.target);
        const optionId = chip?.dataset.optionId;
        const activatingKey = evt.key === 'Enter' || evt.key === ' ' || evt.key === 'Backspace';
        if (optionId == null || !activatingKey || isChipDisabled(chip)) {
            return;
        }

        if (evt.key === 'Backspace') {
            // Move focus to previous option (instead of next in listbox)
            const previousChip = findPreviousChip(container, chip);
            const focusTarget = previousChip || options.getInput?.();
            if (focusTarget) {
                focusTarget.focus();
                focusTarget.setAttribute('tabindex', '0');
            }
        }

        evt.preventDefault();
        removeOption(options, optionId);
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('keydown', handleKeyDown);

    // Attach input backspace handler if an input is provided.
    const input = options.getInput?.();
    let inputHandler: ((evt: KeyboardEvent) => void) | undefined;
    if (input) {
        inputHandler = (evt: KeyboardEvent) => {
            const backspacePressed = evt.key === 'Backspace';
            const cursorAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

            if (!backspacePressed || !cursorAtStart) return;

            evt.stopPropagation();
            evt.preventDefault();

            const lastChip = findPreviousChip(container);
            lastChip?.focus();
        };
        input.addEventListener('keydown', inputHandler);
    }

    // Return cleanup function.
    return () => {
        container.removeEventListener('click', handleClick);
        container.removeEventListener('keydown', handleKeyDown);
        if (input && inputHandler) {
            input.removeEventListener('keydown', inputHandler);
        }
    };
}
